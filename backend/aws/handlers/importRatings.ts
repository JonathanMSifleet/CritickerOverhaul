import {
  AttributeValue,
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  BatchWriteItemCommandOutput,
  DynamoDBClient,
  QueryCommand,
  QueryCommandOutput,
  UpdateItemCommand,
  UpdateItemCommandOutput
} from '@aws-sdk/client-dynamodb';

import IHTTP from '../shared/interfaces/IHTTP';
import IRating from '../../../shared/interfaces/IRating';
import chunk from 'chunk';
import { connectionDetails } from '../shared/constants/ConnectionDetails';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from '../shared/functions/DynamoDB/createDynamoSearchQuery';
import createDynamoUpdateQuery from '../shared/functions/DynamoDB/createDynamoUpdateQuery';
import { marshall } from '@aws-sdk/util-dynamodb';
import middy from '@middy/core';
import serverlessMysql from 'serverless-mysql';

const mysql = serverlessMysql({ config: connectionDetails });
const dbClient = new DynamoDBClient({});

interface IDynamoReview {
  rating: { N: string };
  imdb_title_id: { N: string };
}

interface IPercentile {
  username: string;
  imdb_title_id: number;
  percentile: number;
}

const importRatings = async (event: { body: string; pathParameters: { username: string } }): Promise<IHTTP> => {
  const { ratings } = JSON.parse(event.body);
  const { username } = event.pathParameters;

  const filteredRatings = await filterRatings(ratings, username);
  const chunkedRatings = chunk(filteredRatings, 25);

  try {
    const batchInserts = [] as Promise<BatchWriteItemCommandOutput | IHTTP>[];
    chunkedRatings.forEach(async (reviewChunk: IRating[]) => {
      batchInserts.push(batchInsertRatings(reviewChunk));
    });

    const result = await Promise.all(batchInserts);
    // @ts-expect-error statusCode does exist
    if (result.some((res) => res.statusCode === 520)) return createAWSResErr(520, 'Unhandled Exception');

    console.log(`Successfully inserted ${filteredRatings.length} reviews`);

    const userRatings = await getUserRatings(username);

    // @ts-expect-error Count does exist:
    await updateNumUserRatings(username, userRatings.Count);
    // @ts-expect-error Items does exist:
    const extractedRatings = extractRatings(userRatings.Items);
    const percentiles = calculatePercentiles(username, extractedRatings);
    await updatePercentiles(percentiles);

    return {
      statusCode: 200,
      body: JSON.stringify(
        `Inserted ${filteredRatings.length} out of ${ratings.length} reviews. Success rate: ${(
          100 -
          ((filteredRatings.length - ratings.length) / ratings.length) * -100
        ).toFixed(2)}%`
      )
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const batchInsertRatings = async (reviews: IRating[]): Promise<BatchWriteItemCommandOutput | IHTTP> => {
  const items = [] as { PutRequest: { Item: { [key: string]: AttributeValue } } }[];

  reviews.forEach((review: IRating) => items.push({ PutRequest: { Item: marshall(review) } }));

  const params = {
    RequestItems: {
      [process.env.RATINGS_TABLE_NAME!]: items
    }
  } as BatchWriteItemCommandInput;

  try {
    return await dbClient.send(new BatchWriteItemCommand(params));
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const calculatePercentiles = (
  username: string,
  ratings: { imdb_title_id: number; rating: number }[]
): IPercentile[] => {
  ratings = ratings.sort((a, b) => a.rating - b.rating);
  const numValues = ratings.length;

  const percentiles: IPercentile[] = [];

  let latestValue = -1;
  let firstAppearance = -1;

  for (let i = 0; i < numValues; i++) {
    if (ratings[i].rating > latestValue) {
      latestValue = ratings[i].rating;
      firstAppearance = i;
    }

    const percentile = Math.round((firstAppearance / numValues) * 100);
    percentiles.push({ username, imdb_title_id: ratings[i].imdb_title_id, percentile });
  }

  console.log('Calculated percentiles successfully');
  return percentiles;
};

const extractRatings = (userReviews: IDynamoReview[]): { imdb_title_id: number; rating: number }[] =>
  userReviews.map((review: IDynamoReview) => ({
    rating: Number(review.rating.N),
    imdb_title_id: Number(review.imdb_title_id.N)
  }));

const filterRatings = async (reviews: IRating[], username: string): Promise<IRating[]> => {
  const matchedFilmIDs = await getMatchedFilmIDs(reviews);

  const filteredRatings = reviews.filter((review: { imdb_title_id: number }) =>
    matchedFilmIDs.includes(review.imdb_title_id)
  );

  return filteredRatings.map((rating) => ({ ...rating, username }));
};

const getMatchedFilmIDs = async (reviews: { imdb_title_id: number }[]): Promise<number[]> => {
  const sql = 'SELECT imdb_title_id FROM films WHERE imdb_title_id = ?';

  const queries = [] as Promise<{ RowDataPacket: { imdb_title_id: number } }>[];
  reviews.forEach((review: { imdb_title_id: number }) => queries.push(mysql.query(sql, [review.imdb_title_id])));

  const results = await Promise.all(queries);
  mysql.quit();

  const matchedIDs = [] as number[];

  results.forEach((result) => {
    try {
      // @ts-expect-error 0 can be used as index
      matchedIDs.push(result[0].imdb_title_id);
    } catch (error) {}
  });

  return matchedIDs;
};

const updatePercentiles = async (percentiles: IPercentile[]): Promise<IHTTP | void> => {
  try {
    const updateRequests: Promise<UpdateItemCommandOutput>[] = [];

    percentiles.forEach(async (percentile: IPercentile) => {
      const params = createDynamoUpdateQuery(
        process.env.RATINGS_TABLE_NAME!,
        'imdb_title_id',
        percentile.imdb_title_id.toString(),
        'N',
        'ratingPercentile',
        percentile.percentile.toString(),
        'N',
        'username',
        percentile.username,
        'S'
      );

      updateRequests.push(dbClient.send(new UpdateItemCommand(params)));
    });

    await Promise.all(updateRequests);
    console.log('Updated percentiles successfully');
    return;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const getUserRatings = async (username: string): Promise<QueryCommandOutput | IHTTP> => {
  const query = createDynamoSearchQuery(
    process.env.RATINGS_TABLE_NAME!,
    'imdb_title_id, rating',
    'username',
    username,
    'S',
    'username'
  );

  try {
    return await dbClient.send(new QueryCommand(query));
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled exception');
};

const updateNumUserRatings = async (username: string, numRatings: number): Promise<IHTTP | void> => {
  const params = createDynamoUpdateQuery(
    process.env.USER_TABLE_NAME!,
    'username',
    username,
    'S',
    'numRatings',
    numRatings.toString(),
    'N'
  );

  try {
    await dbClient.send(new UpdateItemCommand(params));
    console.log('Updated number of ratings successfully');
    return;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(importRatings).use(cors());
