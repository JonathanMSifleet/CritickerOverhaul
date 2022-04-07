import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import cors from '@middy/http-cors';
import getUserRatings from '../../shared/functions/getUserRatings';
import IHTTP from '../../shared/interfaces/IHTTP';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const aggregateUserRatings = async (event: { pathParameters: { username: string } }): Promise<IHTTP> => {
  const username = event.pathParameters.username;

  const ratings = await getUserRatings(dbClient, username, 'imdbID, ratingPercentile');

  const payload = {
    username: { S: username },
    ratings: { S: JSON.stringify(ratings) }
  };

  const query = {
    TableName: process.env.USER_RATINGS_TABLE_NAME!,
    Item: payload
  };

  try {
    await dbClient.send(new PutItemCommand(query));

    console.log('Successfully updated user-ratings-table ratings');
    return { statusCode: 204 };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(403, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(aggregateUserRatings).use(cors());
