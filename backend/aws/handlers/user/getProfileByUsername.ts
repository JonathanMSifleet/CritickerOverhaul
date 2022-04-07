import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import createDynamoSearchQuery from '../../shared/functions/queries/createDynamoSearchQuery';
import IHTTP from '../../shared/interfaces/IHTTP';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const getProfileByUsername = async (event: { pathParameters: { username: string } }): Promise<IHTTP> => {
  const { username } = event.pathParameters;

  const query = createDynamoSearchQuery(
    process.env.USER_TABLE_NAME!,
    'country, email, firstName, gender, lastName, memberSince, numRatings, username',
    'username',
    username,
    'S'
  );

  try {
    const result = await dbClient.send(new QueryCommand(query));
    if (result.Items!.length === 0) return createAWSResErr(404, 'No user found');

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
