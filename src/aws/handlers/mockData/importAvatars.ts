import createAWSResErr from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import cors from '@middy/http-cors';
import IHTTP from '../../interfaces/IHTTP';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const importAvatars = async (event: { body: string; pathParameters: { username: string } }): Promise<void | IHTTP> => {
  const avatar = JSON.parse(event.body);
  const username = event.pathParameters.username;

  const params = {
    TableName: process.env.USER_TABLE_NAME!,
    Key: {
      username: { S: username }
    },
    UpdateExpression: 'set avatar = :avatar',
    ExpressionAttributeValues: {
      ':avatar': { S: avatar }
    },
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    await dbClient.send(new UpdateItemCommand(params));

    console.log('Successfully imported avatars');
    return { statusCode: 204 };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(importAvatars).use(cors());
