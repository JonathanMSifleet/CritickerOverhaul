import { DynamoDBClient, QueryCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import createDynamoSearchQuery from '../../shared/functions/DynamoDB/createDynamoSearchQuery';
import createDynamoUpdateQuery from '../../shared/functions/DynamoDB/createDynamoUpdateQuery';
import IHTTP from '../../shared/interfaces/IHTTP';
import middy from '@middy/core';
import percentRank from 'percentile-rank';

const dbClient = new DynamoDBClient({});

interface IRating {
  imdbID: string;
  percentile?: number;
  rating: number;
  username: string;
}

const updatePercentiles = async (event: { pathParameters: { username: string } }): Promise<IHTTP> => {
  const username = event.pathParameters.username;

  const ratings = (await getRatings(username)) as IRating[];
  if (ratings instanceof Error) return createAWSResErr(520, ratings.message);

  const ratingValues = ratings.map((rating) => rating.rating);

  const updatedPercentiles: IRating[] = [];
  ratings.forEach((rating) =>
    updatedPercentiles.push({ ...rating, percentile: calculatePercentile(ratingValues, rating.rating) })
  );

  try {
    for await (const percentile of updatedPercentiles) {
      const result = await updatePercentile(username, percentile);
      if (result instanceof Error) return createAWSResErr(520, 'Error updating percentile');
    }

    console.log('Successfully updated percentiles');
    return {
      statusCode: 201,
      body: JSON.stringify('Success')
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(updatePercentiles).use(cors());

const calculatePercentile = (ratings: number[], curRating: number): number =>
  Math.round(percentRank(ratings, curRating) * 100);

const getRatings = async (username: string): Promise<IHTTP | IRating[]> => {
  const query = createDynamoSearchQuery(
    process.env.RATINGS_TABLE_NAME!,
    'imdbID, rating',
    'username',
    username,
    'S',
    'usernameRating'
  );

  try {
    const results = await dbClient.send(new QueryCommand(query));
    return results.Items!.map((result) => unmarshall(result) as IRating);
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const updatePercentile = async (username: string, rating: IRating): Promise<void | IHTTP> => {
  const query = createDynamoUpdateQuery(
    process.env.RATINGS_TABLE_NAME!,
    'imdbID',
    rating.imdbID.toString(),
    'N',
    'ratingPercentile',
    rating.percentile!.toString(),
    'N',
    'username',
    username,
    'S'
  );

  try {
    await dbClient.send(new UpdateItemCommand(query));
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }
};
