import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

import IHTTP from '../../shared/interfaces/IHTTP';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import createDynamoUpdateQuery from '../../shared/functions/DynamoDB/createDynamoUpdateQuery';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const addWriters = async (event: { body: string }): Promise<IHTTP> => {
  const item = JSON.parse(event.body);
  console.log('🚀 ~ file: addWriters.ts ~ line 6 ~ addWriters ~ item', item);

  const params = createDynamoUpdateQuery(
    process.env.FILMS_TABLE_NAME!,
    'imdbID',
    item.imdbID.toString(),
    'N',
    'writers',
    item.writers,
    'S'
  );
  console.log('🚀 ~ file: addWriters.ts ~ line 24 ~ addWriters ~ params', params);

  try {
    const result = await dbClient.send(new UpdateItemCommand(params));
    console.log('🚀 ~ file: addWriters.ts ~ line 28 ~ addWriters ~ result', result);

    return {
      statusCode: 200,
      body: JSON.stringify('Success')
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, JSON.stringify(error.message));
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(addWriters).use(cors());
