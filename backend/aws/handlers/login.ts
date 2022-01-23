import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from '../shared/functions/createDynamoSearchQuery';
import IHTTP from '../shared/interfaces/IHTTP';
import IHTTPErr from '../shared/interfaces/IHTTPErr';
const dbClient = new DynamoDBClient({});

const login = async (event: { body: string }): Promise<IHTTP | IHTTPErr> => {
  const { email, password } = JSON.parse(event.body);

  if (!email || !password) return createAWSResErr(401, 'Please provide email and password!');

  const query = createDynamoSearchQuery(
    process.env.USER_TABLE_NAME!,
    'UID',
    'S',
    email,
    'username, email'
  );

  try {
    const result = await dbClient.send(new GetItemCommand(query));
    const user = result.Item;

    if (user === undefined) return createAWSResErr(404, 'No user found with that email');
    if (password !== user.password) return createAWSResErr(401, 'Incorrect password');

    console.log('Logged in successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({ ...user })
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(404, error.message);
  }

  return createAWSResErr(500, 'Internal Server Error');
};

export const handler = middy(login).use(cors());
