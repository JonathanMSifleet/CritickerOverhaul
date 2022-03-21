import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';

import IHTTP from '../shared/interfaces/IHTTP';
import alterNumRatings from '../shared/functions/alterNumRatings';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const deleteRating = async (event: { pathParameters: { imdbID: number; username: string } }): Promise<IHTTP> => {
  const { imdbID, username } = event.pathParameters;

  try {
    await dbClient.send(
      new DeleteItemCommand({
        TableName: process.env.RATINGS_TABLE_NAME,
        Key: {
          imdbID: { N: imdbID.toString() },
          username: { S: username }
        }
      })
    );

    await alterNumRatings(username, false);

    console.log('Rating deleted successfully');
    return { statusCode: 204 };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(403, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(deleteRating).use(cors());
