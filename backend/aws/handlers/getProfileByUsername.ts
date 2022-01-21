import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from '../shared/functions/createDynamoSearchQuery';
import IHTTP from '../shared/interfaces/IHTTP';
import IHTTPErr from '../shared/interfaces/IHTTPErr';

const getProfileByUsername = async (event: {
  pathParameters: { username: string };
}): Promise<IHTTP | IHTTPErr> => {
  const { username } = event.pathParameters;

  const query = createDynamoSearchQuery(
    process.env.USER_TABLE_NAME!,
    'UID',
    'S',
    username,
    'username, UID, memberSince, numRatings'
  );

  try {
    const result = await new DynamoDBClient({}).send(new GetItemCommand(query));

    const user = unmarshall(result.Item!);

    console.log('Sucessfully fetched user profile');
    return {
      statusCode: 200,
      body: JSON.stringify({ ...user })
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Internal Server Error');
};

export const handler = middy(getProfileByUsername).use(cors());
