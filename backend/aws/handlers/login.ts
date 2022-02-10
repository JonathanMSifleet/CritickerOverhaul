import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from '../shared/functions/createDynamoSearchQuery';
import IHTTP from '../shared/interfaces/IHTTP';
import getUserAvatarFromDB from './../shared/functions/getUserAvatarFromDB';
const dbClient = new DynamoDBClient({});

const login = async (event: { body: string }): Promise<IHTTP> => {
  const { email, password } = JSON.parse(event.body);

  const query = createDynamoSearchQuery(
    process.env.USER_TABLE_NAME!,
    'username, email, password, UID',
    'email',
    email,
    'S',
    process.env.EMAIL_INDEX!
  );

  try {
    const result = await dbClient.send(new QueryCommand(query));
    if (result.Count === 0)
      return createAWSResErr(404, 'Email address is not associated with any user');

    const user = unmarshall(result.Items![0]);
    if (password !== user.password) return createAWSResErr(401, 'Password is incorrect');

    const userAvatar = await getUserAvatarFromDB(user.username);

    console.log('Logged in successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({ username: user.username, UID: user.UID, avatar: userAvatar })
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(404, error.message);
  }

  return createAWSResErr(500, 'Internal Server Error');
};

export const handler = middy(login).use(cors());
