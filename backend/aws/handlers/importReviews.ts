import {
  AttributeValue,
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  BatchWriteItemCommandOutput,
  DynamoDBClient,
  QueryCommand,
  QueryCommandOutput,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb';

import IHTTP from '../shared/interfaces/IHTTP';
import IReview from '../../../shared/interfaces/IReview';
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
  UID: string;
  imdb_title_id: number;
  percentile: number;
}

const importReviews = async (event: { body: string }): Promise<IHTTP> => {
  const { reviews, UID } = JSON.parse(event.body);

  const filteredReviews = await filterReviews(reviews);
  const chunkedReviews = chunk(filteredReviews, 25);

  try {
    const batchInserts = [] as Promise<BatchWriteItemCommandOutput | IHTTP>[];
    chunkedReviews.forEach(async (reviewChunk: IReview[]) => {
      batchInserts.push(batchInsertRatings(reviewChunk));
    });

    await Promise.all(batchInserts);
    console.log(`Successfully inserted ${filteredReviews.length} reviews`);

    const userReviews = await getUserReviews(UID);

    // @ts-expect-error Count does exist:
    await updateUserRatings(UID, userReviews.Count);
    // @ts-expect-error Items does exist:
    const extractedRatings = extractRatings(userReviews.Items);
    const percentiles = calculatePercentiles(UID, extractedRatings);
    console.log('🚀 ~ file: importReviews.ts ~ line 60 ~ importReviews ~ percentiles', percentiles);

    return {
      statusCode: 200,
      body: JSON.stringify(
        `Inserted ${filteredReviews.length} out of ${reviews.length} reviews. Success rate: ${(
          100 -
          ((filteredReviews.length - reviews.length) / reviews.length) * -100
        ).toFixed(2)}%`
      )
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const batchInsertRatings = async (reviews: IReview[]): Promise<BatchWriteItemCommandOutput | IHTTP> => {
  const items = [] as { PutRequest: { Item: { [key: string]: AttributeValue } } }[];

  reviews.forEach((review: IReview) => items.push({ PutRequest: { Item: marshall(review) } }));

  const params = {
    RequestItems: {
      [process.env.RATINGS_TABLE_NAME as string]: items
    }
  } as BatchWriteItemCommandInput;

  try {
    return await dbClient.send(new BatchWriteItemCommand(params));
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const calculatePercentiles = (UID: string, ratings: { imdb_title_id: number; rating: number }[]): IPercentile[] => {
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
    percentiles.push({ UID, imdb_title_id: ratings[i].imdb_title_id, percentile });
  }

  console.log('Calculated percentiles successfully');
  return percentiles;
};

const extractRatings = (userReviews: IDynamoReview[]): { imdb_title_id: number; rating: number }[] =>
  userReviews.map((review: IDynamoReview) => ({
    rating: Number(review.rating.N),
    imdb_title_id: Number(review.imdb_title_id.N)
  }));

const filterReviews = async (reviews: IReview[]): Promise<IReview[]> => {
  const matchedFilmIDs = await getMatchedFilmIDs(reviews);

  return reviews.filter((review: { imdb_title_id: number }) => matchedFilmIDs.includes(review.imdb_title_id));
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

const getUserReviews = async (UID: string): Promise<QueryCommandOutput | IHTTP> => {
  const query = createDynamoSearchQuery(
    process.env.RATINGS_TABLE_NAME!,
    'imdb_title_id, rating',
    'UID',
    UID,
    'S',
    'UID'
  );

  try {
    return await dbClient.send(new QueryCommand(query));
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled exception');
};

const updateUserRatings = async (UID: string, numRatings: number): Promise<IHTTP | void> => {
  const params = createDynamoUpdateQuery(process.env.USER_TABLE_NAME!, 'UID', UID, 'S', 'numRatings', numRatings, 'N');

  try {
    await dbClient.send(new UpdateItemCommand(params));
    console.log('Updated number of ratings successfully');
    return;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(importReviews).use(cors());
