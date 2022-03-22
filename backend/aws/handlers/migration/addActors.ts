import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

import IHTTP from '../../shared/interfaces/IHTTP';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import createDynamoUpdateQuery from '../../shared/functions/DynamoDB/createDynamoUpdateQuery';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const addActors = async (event: { body: string }): Promise<IHTTP> => {
  const item = JSON.parse(event.body);
  console.log('🚀 ~ file: addActors.ts ~ line 6 ~ addActors ~ item', item);

  const params = createDynamoUpdateQuery(
    process.env.FILMS_TABLE_NAME!,
    'imdbID',
    item.imdbID.toString(),
    'N',
    'actors',
    item.actors,
    'S'
  );
  console.log('🚀 ~ file: addActors.ts ~ line 24 ~ addActors ~ params', params);

  try {
    const result = await dbClient.send(new UpdateItemCommand(params));
    console.log('🚀 ~ file: addActors.ts ~ line 28 ~ addActors ~ result', result);

    return {
      statusCode: 200,
      body: JSON.stringify('Success')
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, JSON.stringify(error.message));
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(addActors).use(cors());
