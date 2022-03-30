import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';

import IHTTP from '../shared/interfaces/IHTTP';
import alterNumRatings from '../shared/functions/alterNumRatings';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import middy from '@middy/core';
import validateAccessToken from '../shared/functions/validateAccessToken';

const dbClient = new DynamoDBClient({});

const deleteRating = async (event: {
  pathParameters: { accessToken: string; imdbID: number; username: string };
}): Promise<IHTTP> => {
  const { accessToken, imdbID, username } = event.pathParameters;

  const validToken = await validateAccessToken(username, accessToken);
  if (validToken !== true) return createAWSResErr(401, 'Access token invalid');

  try {
    const result = await deleteRatingFromDynamo(imdbID, username);
    if (result instanceof Error) return createAWSResErr(500, 'Error deleting rating');

    await alterNumRatings(username, -1);

    console.log('Rating deleted successfully');
    return { statusCode: 204 };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(403, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(deleteRating).use(cors());

const deleteRatingFromDynamo = async (imdbID: number, username: string): Promise<void | Error> => {
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
  } catch (error) {
    return new Error();
  }
};
