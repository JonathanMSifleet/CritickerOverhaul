import {
  AttributeValue,
  BatchWriteItemCommand,
  BatchWriteItemCommandOutput,
  DynamoDBClient,
  QueryCommand,
  QueryCommandOutput,
  UpdateItemCommand,
  UpdateItemCommandOutput
} from '@aws-sdk/client-dynamodb';
import createAWSResErr from '../../shared/functions/createAWSResErr';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import chunk from 'chunk';
import cors from '@middy/http-cors';
import createDynamoSearchQuery from '../../shared/functions/queries/createDynamoSearchQuery';
import createDynamoUpdateQuery from '../../shared/functions/queries/createDynamoUpdateQuery';
import IHTTP from '../../interfaces/IHTTP';
import IRating from '../../interfaces/IRating';
import middy from '@middy/core';
import percentRank from 'percentile-rank';
import validateAccessToken from '../../shared/functions/validateAccessToken';

const dbClient = new DynamoDBClient({});

interface IDynamoReview {
  rating: AttributeValue;
  imdbID: AttributeValue;
}

interface IPercentile {
  username: string;
  imdbID: number;
  percentile: number;
}

const importRatings = async (event: {
  body: string;
  headers: { Authorization: string };
  pathParameters: { username: string };
}): Promise<IHTTP> => {
  const { username } = event.pathParameters;
  const accessToken = event.headers.Authorization.split(' ')[1];

  const validToken = await validateAccessToken(dbClient, username, accessToken);
  if (validToken !== true) return createAWSResErr(401, 'Access token invalid');

  const { ratings } = JSON.parse(event.body);

  const filteredRatings = await filterRatings(ratings, username);
  const chunkedRatings = chunk(filteredRatings, 25);

  try {
    const batchInserts: Promise<BatchWriteItemCommandOutput | IHTTP>[] = [];
    chunkedRatings.forEach(async (reviewChunk: IRating[]) => {
      batchInserts.push(batchInsertRatings(reviewChunk));
    });

    const result = await Promise.all(batchInserts);
    // @ts-expect-error statusCode does exist
    if (result.some((res) => res.statusCode === 520)) return createAWSResErr(520, 'Unhandled Exception');

    console.log(`Successfully inserted ${filteredRatings.length} reviews`);

    const userRatings = (await getUserRatings(username)) as QueryCommandOutput;
    if (userRatings instanceof Error) return createAWSResErr(500, 'Error getting user ratings');

    await updateNumUserRatings(username, userRatings.Count!);

    const updatedPercentiles = await updatePercentiles(userRatings.Items as unknown as IDynamoReview[], username);
    if (updatedPercentiles instanceof Error) return createAWSResErr(500, 'Error updating percentiles');

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

export const handler = middy(importRatings).use(cors());

const batchInsertRatings = async (reviews: IRating[]): Promise<BatchWriteItemCommandOutput | IHTTP> => {
  const items = reviews.map((review) => ({ PutRequest: { Item: marshall(review) } }));

  const params = {
    RequestItems: {
      [process.env.RATINGS_TABLE_NAME!]: items
    }
  };

  try {
    return await dbClient.send(new BatchWriteItemCommand(params));
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const calculatePercentiles = (username: string, ratings: { imdbID: number; rating: number }[]): IPercentile[] => {
  ratings = ratings.sort((a, b) => a.rating - b.rating);
  const extractedRatings = ratings.map((rating) => rating.rating);

  const percentiles: IPercentile[] = [];

  ratings.forEach((rating) => {
    const calculatedPercentile = Math.round(percentRank(extractedRatings, rating.rating) * 100);

    percentiles.push({ username, imdbID: rating.imdbID, percentile: calculatedPercentile });
  });

  return percentiles;
};

const extractRatings = (userReviews: IDynamoReview[]): { imdbID: number; rating: number }[] =>
  userReviews.map((review: IDynamoReview) => ({
    rating: Number(review.rating.N),
    imdbID: Number(review.imdbID.N)
  }));

const filterRatings = async (reviews: IRating[], username: string): Promise<IRating[]> => {
  const matchedImdbIDs: number[] = [];

  for await (const review of reviews) {
    const query = createDynamoSearchQuery(
      process.env.FILMS_TABLE_NAME!,
      'imdbID',
      'imdbID',
      review.imdbID.toString(),
      'N'
    );

    try {
      const result = await dbClient.send(new QueryCommand(query));
      try {
        const imdbID = unmarshall(result.Items![0]).imdbID;
        matchedImdbIDs.push(imdbID);
      } catch (error) {}
    } catch (error) {
      console.error(error);
    }
  }

  const filteredRatings = reviews.filter((review: { imdbID: number }) => matchedImdbIDs.includes(review.imdbID));

  return filteredRatings.map((rating) => ({ ...rating, username }));
};

const updatePercentiles = async (ratings: IDynamoReview[], username: string): Promise<IHTTP | void> => {
  const extractedRatings = extractRatings(ratings);
  const percentiles = calculatePercentiles(username, extractedRatings);

  try {
    const updateRequests: Promise<UpdateItemCommandOutput>[] = [];

    percentiles.forEach(async (percentile: IPercentile) => {
      const params = createDynamoUpdateQuery(
        process.env.RATINGS_TABLE_NAME!,
        'imdbID',
        percentile.imdbID.toString(),
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
    'imdbID, rating',
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
