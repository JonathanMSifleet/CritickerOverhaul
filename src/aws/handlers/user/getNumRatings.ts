import createAWSResErr from '../../shared/functions/createAWSResErr';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import cors from '@middy/http-cors';
import getNumRatingsFromDB from '../../shared/functions/getNumRatingsFromDB';
import IHTTP from '../../interfaces/IHTTP';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const getNumRatings = async (event: { pathParameters: { username: string } }): Promise<IHTTP> => {
  const { username } = event.pathParameters;

  try {
    const numRatings = await getNumRatingsFromDB(dbClient, username);

    console.log('Successfully got number of ratings');
    return {
      statusCode: 200,
      body: JSON.stringify(numRatings)
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(getNumRatings).use(cors());
