import { BatchWriteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import createAWSResErr from '../../shared/functions/createAWSResErr';
import cors from '@middy/http-cors';
import IHTTP from '../../interfaces/IHTTP';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const importFilmBatch = async (event: { body: string }): Promise<IHTTP | void> => {
  const films = JSON.parse(event.body);

  const params = {
    RequestItems: {
      [process.env.FILMS_TABLE_NAME!]: films
    }
  };

  try {
    await dbClient.send(new BatchWriteItemCommand(params));

    return { statusCode: 204 };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, [error.message, films]);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(importFilmBatch).use(cors());
