import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

import IHTTP from '../shared/interfaces/IHTTP';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from '../shared/functions/createDynamoSearchQuery';
import middy from '@middy/core';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const dbClient = new DynamoDBClient({});

const getProfileByUsername = async (event: { pathParameters: { username: string } }): Promise<IHTTP> => {
  const { username } = event.pathParameters;

  const query = createDynamoSearchQuery(
    process.env.USER_TABLE_NAME!,
    'email, firstName, gender, lastName, memberSince, numRatings, UID, username',
    'username',
    username,
    'S',
    process.env.USERNAME_INDEX!
  );

  try {
    const result = await dbClient.send(new QueryCommand(query));
    const user = unmarshall(result.Items![0]);

    console.log('Sucessfully fetched user profile');
    return {
      statusCode: 200,
      body: JSON.stringify({ ...user })
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(getProfileByUsername).use(cors());
