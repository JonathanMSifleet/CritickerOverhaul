import { DynamoDBClient, QueryCommand, QueryCommandOutput, UpdateItemCommand } from '@aws-sdk/client-dynamodb';

import IHTTP from '../shared/interfaces/IHTTP';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from '../shared/functions/DynamoDB/createDynamoSearchQuery';
import createDynamoUpdateQuery from '../shared/functions/DynamoDB/createDynamoUpdateQuery';
import generateAccessToken from '../shared/functions/generateAccessToken';
import getUserAvatarFromDB from './../shared/functions/getUserAvatarFromDB';
import middy from '@middy/core';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const dbClient = new DynamoDBClient({});

const login = async (event: { body: string }): Promise<IHTTP> => {
  const { email, password } = JSON.parse(event.body);

  try {
    const result = await loginUser(email);
    if (result.Count === 0) return createAWSResErr(404, 'Email address is not associated with any user');

    const user = unmarshall(result.Items![0]);
    if (password !== user.password) return createAWSResErr(401, 'Password is incorrect');

    const userAvatar = await getUserAvatar(user.username);

    let newAccessToken;
    try {
      newAccessToken = await verifyAccessToken(user.username, user.accessToken);
    } catch (error) {
      return createAWSResErr(500, 'Error verifying access token');
    }

    console.log('Logged in successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({ username: user.username, avatar: userAvatar, accessToken: newAccessToken })
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(404, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(login).use(cors());

const createNewAccessToken = async (username: string): Promise<string> => {
  const refreshedToken = await generateAccessToken();
  console.log('🚀 ~ file: login.ts ~ line 50 ~ createNewAccessToken ~ refreshedToken', refreshedToken);

  const params = createDynamoUpdateQuery(
    process.env.USER_TABLE_NAME!,
    'username',
    username,
    'S',
    'accessToken',
    JSON.stringify(refreshedToken),
    'S'
  );

  const result = await dbClient.send(new UpdateItemCommand(params));
  console.log('🚀 ~ file: login.ts ~ line 85 ~ verifyAccessToken ~ result', result);
  return JSON.stringify(refreshedToken);
};

const getUserAvatar = async (username: string): Promise<string | undefined> => {
  try {
    return await getUserAvatarFromDB(username);
  } catch (error) {
    console.log('No avatar found');
    return undefined;
  }
};

const loginUser = async (email: string): Promise<QueryCommandOutput> => {
  const query = createDynamoSearchQuery(
    process.env.USER_TABLE_NAME!,
    'username, email, password, accessToken',
    'email',
    email,
    'S',
    'email'
  );

  return await dbClient.send(new QueryCommand(query));
};

const verifyAccessToken = async (username: string, oldAccessToken: string): Promise<string | IHTTP> => {
  if (oldAccessToken === undefined) return await createNewAccessToken(username);

  const { accessTokenExpiry } = JSON.parse(oldAccessToken);
  if (accessTokenExpiry !== undefined && accessTokenExpiry > Date.now()) return oldAccessToken;

  return await createNewAccessToken(username);
};
