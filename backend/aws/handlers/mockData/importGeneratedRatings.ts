import { BatchWriteItemCommand, BatchWriteItemCommandInput, DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import cors from '@middy/http-cors';
import IHTTP from '../../shared/interfaces/IHTTP';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const importGeneratedRatings = async (event: { body: string }): Promise<void | IHTTP> => {
  const ratings = JSON.parse(event.body);

  const params: BatchWriteItemCommandInput = {
    RequestItems: {
      [process.env.RATINGS_TABLE_NAME!]: ratings
    }
  };

  try {
    await dbClient.send(new BatchWriteItemCommand(params));

    console.log('Successfully imported ratings');
    return {
      statusCode: 200,
      body: JSON.stringify('')
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(importGeneratedRatings).use(cors());
