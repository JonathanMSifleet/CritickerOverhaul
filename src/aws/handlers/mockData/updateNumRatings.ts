import createAWSResErr from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { parallelScan } from '@shelf/dynamodb-parallel-scan';
import cors from '@middy/http-cors';
import getNumRatingsFromDB from '../../shared/functions/getNumRatingsFromDB';
import IHTTP from '../../interfaces/IHTTP';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const updateNumRatings = async (): Promise<IHTTP> => {
  const usernames = (await getUsernames()) as string[];
  if (usernames instanceof Error) return createAWSResErr(500, 'Error getting usernames');

  const updateRatingRequests: Promise<void | IHTTP>[] = [];
  usernames.forEach(async (username) => {
    updateRatingRequests.push(updateRatings(username));
  });

  try {
    await Promise.all(updateRatingRequests);

    return { statusCode: 204 };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(updateNumRatings).use(cors());

const getUsernames = async (): Promise<string[] | IHTTP> => {
  try {
    const usernames = await parallelScan(
      {
        TableName: process.env.USER_TABLE_NAME!,
        ProjectionExpression: 'username'
      },
      { concurrency: 1000 }
    );

    return usernames!.map((item) => item.username);
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const updateRatings = async (username: string): Promise<void | IHTTP> => {
  const numRatings = await getNumRatingsFromDB(dbClient, username);

  const params = {
    TableName: process.env.USER_TABLE_NAME!,
    Key: {
      username: { S: username }
    },
    UpdateExpression: 'set numRatings = :val',
    ExpressionAttributeValues: {
      ':val': { N: numRatings.toString() }
    },
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    await dbClient.send(new UpdateItemCommand(params));
    console.log('Number of ratings altered successfully');
    return;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};
