import createAWSResErr from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import cors from '@middy/http-cors';
import createDynamoUpdateQuery from '../../shared/functions/queries/createDynamoUpdateQuery';
import getUserRatings from '../../shared/functions/getUserRatings';
import IHTTP from '../../interfaces/IHTTP';
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

  const ratings = (await getUserRatings(dbClient, username, 'imdbID, rating')) as unknown as IRating[];
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
    return { statusCode: 204 };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(updatePercentiles).use(cors());

const calculatePercentile = (ratings: number[], curRating: number): number =>
  Math.round(percentRank(ratings, curRating) * 100);

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
