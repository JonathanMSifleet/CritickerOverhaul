import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from '../shared/functions/createDynamoSearchQuery';
import IHTTP from '../shared/interfaces/IHTTP';
const dbClient = new DynamoDBClient({});

const login = async (event: { body: string }): Promise<IHTTP> => {
  const { email, password } = JSON.parse(event.body);

  if (!email || !password) return createAWSResErr(401, 'Please provide email and password!');

  const query = createDynamoSearchQuery(
    process.env.USER_TABLE_NAME!,
    process.env.EMAIL_INDEX!,
    'username, email, password, UID',
    'email',
    email,
    'S'
  );

  try {
    const result = await dbClient.send(new QueryCommand(query));
    const user = unmarshall(result.Items![0]);

    if (user === undefined) return createAWSResErr(404, 'No user found with that email');
    if (password !== user.password) return createAWSResErr(401, 'Incorrect password');

    console.log('Logged in successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({ username: user.username, UID: user.UID })
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(404, error.message);
  }

  return createAWSResErr(500, 'Internal Server Error');
};

export const handler = middy(login).use(cors());
