import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

import IHTTP from '../shared/interfaces/IHTTP';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from '../shared/functions/DynamoDB/createDynamoSearchQuery';
import getUserAvatarFromDB from './../shared/functions/getUserAvatarFromDB';
import middy from '@middy/core';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const dbClient = new DynamoDBClient({});

const login = async (event: { body: string }): Promise<IHTTP> => {
  const { email, password } = JSON.parse(event.body);

  const query = createDynamoSearchQuery(
    process.env.USER_TABLE_NAME!,
    'username, email, password',
    'email',
    email,
    'S',
    'email'
  );

  try {
    const result = await dbClient.send(new QueryCommand(query));
    if (result.Count === 0) return createAWSResErr(404, 'Email address is not associated with any user');

    const user = unmarshall(result.Items![0]);
    if (password !== user.password) return createAWSResErr(401, 'Password is incorrect');

    let userAvatar;
    try {
      userAvatar = await getUserAvatarFromDB(user.username);
    } catch (error) {
      console.log('No avatar found');
    }

    console.log('Logged in successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({ username: user.username, avatar: userAvatar })
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(404, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(login).use(cors());
