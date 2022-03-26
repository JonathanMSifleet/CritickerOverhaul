import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

import IHTTP from '../shared/interfaces/IHTTP';
import IRating from '../../../shared/interfaces/IRating';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from '../shared/functions/DynamoDB/createDynamoSearchQuery';
import middy from '@middy/core';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const dbClient = new DynamoDBClient({});

const getUserRating = async (event: { pathParameters: { imdbID: number; username: string } }): Promise<IHTTP> => {
  const { imdbID, username } = event.pathParameters;

  try {
    const rating = await getUserRatingFromDB(imdbID, username);
    if (!rating) return createAWSResErr(404, 'No rating found');

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

// to do:
const getUserRatingFromDB = async (imdbID: number, username: string): Promise<IRating> => {
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

  const result = await dbClient.send(new QueryCommand(query));
  return unmarshall(result.Items![0]) as IRating;
};

export const handler = middy(getUserRating).use(cors());
