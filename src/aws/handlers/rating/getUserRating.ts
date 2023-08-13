import createAWSResErr from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import createDynamoSearchQuery from '../../shared/functions/queries/createDynamoSearchQuery';
import IHTTP from '../../interfaces/IHTTP';
import IRating from '../../interfaces/IRating';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const getUserRating = async (event: { pathParameters: { imdbID: number; username: string } }): Promise<IHTTP> => {
  const { imdbID, username } = event.pathParameters;

  try {
    const rating = await getUserRatingFromDB(imdbID, username);
    if (rating instanceof Error) return createAWSResErr(404, 'No rating found');

    console.log('Successfully fetched user rating');
    return {
      statusCode: 200,
      body: JSON.stringify(rating)
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(404, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(getUserRating).use(cors());

const getUserRatingFromDB = async (imdbID: number, username: string): Promise<IRating | Error> => {
  const query = createDynamoSearchQuery(
    process.env.RATINGS_TABLE_NAME!,
    'rating, ratingPercentile, review, createdAt',
    'imdbID',
    imdbID,
    'N',
    undefined,
    'username',
    username,
    'S'
  );

  try {
    const result = await dbClient.send(new QueryCommand(query));
    return unmarshall(result.Items![0]) as IRating;
  } catch (error) {
    return new Error();
  }
};
