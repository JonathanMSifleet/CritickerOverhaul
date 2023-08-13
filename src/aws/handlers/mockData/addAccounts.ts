import { BatchWriteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import createAWSResErr from '../../shared/functions/createAWSResErr';
import cors from '@middy/http-cors';
import IHTTP from '../../interfaces/IHTTP';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const addAccounts = async (event: { body: string }): Promise<IHTTP | void> => {
  const accounts = JSON.parse(event.body);

  const params = {
    RequestItems: {
      [process.env.USER_TABLE_NAME!]: accounts
    }
  };

  try {
    await dbClient.send(new BatchWriteItemCommand(params));

    return { statusCode: 204 };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, [error.message, accounts]);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(addAccounts).use(cors());
