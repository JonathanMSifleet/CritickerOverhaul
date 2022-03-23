import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

import IHTTP from '../../shared/interfaces/IHTTP';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import createDynamoUpdateQuery from '../../shared/functions/DynamoDB/createDynamoUpdateQuery';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const addPeople = async (event: { body: string; pathParameters: { type: string } }): Promise<IHTTP> => {
  const item = JSON.parse(event.body);
  const type = event.pathParameters.type;

  const params = createDynamoUpdateQuery(
    process.env.FILMS_TABLE_NAME!,
    'imdbID',
    item.imdbID.toString(),
    'N',
    `${type}`,
    item[type]!,
    'S'
  );

  try {
    await dbClient.send(new UpdateItemCommand(params!));

    console.log(`Successfully added ${type}`);
    return {
      statusCode: 200,
      body: JSON.stringify('Success')
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, JSON.stringify(error.message));
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(addPeople).use(cors());