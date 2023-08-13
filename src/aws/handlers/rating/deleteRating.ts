import createAWSResErr from '../../shared/functions/createAWSResErr';
import { DeleteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import alterNumRatings from '../../shared/functions/alterNumRatings';
import cors from '@middy/http-cors';
import IHTTP from '../../interfaces/IHTTP';
import middy from '@middy/core';
import validateAccessToken from '../../shared/functions/validateAccessToken';

const dbClient = new DynamoDBClient({});

const deleteRating = async (event: {
  headers: { Authorization: string };
  pathParameters: { imdbID: number; username: string };
}): Promise<IHTTP> => {
  const { imdbID, username } = event.pathParameters;
  const accessToken = event.headers.Authorization.split(' ')[1];

  const validToken = await validateAccessToken(dbClient, username, accessToken);
  if (validToken !== true) return createAWSResErr(401, 'Access token invalid');

  try {
    const result = await deleteRatingFromDynamo(imdbID, username);
    if (result instanceof Error) return createAWSResErr(500, 'Error deleting rating');

    await alterNumRatings(dbClient, username, -1);

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
