import { BatchWriteItemCommand, BatchWriteItemCommandInput, DynamoDBClient } from '@aws-sdk/client-dynamodb';

import IHTTP from '../../shared/interfaces/IHTTP';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const importAvatars = async (event: { body: string }): Promise<void | IHTTP> => {
  const images = JSON.parse(event.body);

  const params: BatchWriteItemCommandInput = {
    RequestItems: {
      [process.env.AVATAR_TABLE_NAME!]: images
    }
  };

  try {
    await dbClient.send(new BatchWriteItemCommand(params));

    console.log('Successfully imported avatars');
    return {
      statusCode: 200,
      body: JSON.stringify('')
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(importAvatars).use(cors());
