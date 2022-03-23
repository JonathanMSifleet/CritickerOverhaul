import { BatchWriteItemCommand, BatchWriteItemCommandInput, DynamoDBClient } from '@aws-sdk/client-dynamodb';

import IHTTP from '../../shared/interfaces/IHTTP';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const importFilmBatch = async (event: { body: string }): Promise<IHTTP | void> => {
  const films = JSON.parse(event.body);

  const params = {
    RequestItems: {
      [process.env.FILMS_TABLE_NAME!]: films
    }
  } as BatchWriteItemCommandInput;

  try {
    await dbClient.send(new BatchWriteItemCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify('Successfully inserted batch')
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, [error.message, films]);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(importFilmBatch).use(cors());