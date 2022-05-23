import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, QueryCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import createDynamoSearchQuery from '../../shared/functions/queries/createDynamoSearchQuery';
import createDynamoUpdateQuery from '../../shared/functions/queries/createDynamoUpdateQuery';
import generateAccessToken from '../../shared/functions/generateAccessToken';
import getExistingTCI from '../../shared/functions/getExistingTCI';
import getUserAvatarFromDB from '../../shared/functions/getUserAvatarFromDB';
import IHTTP from '../../shared/interfaces/IHTTP';
import ITCI from '../../../../shared/interfaces/ITCI';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

interface IPayload {
  accessToken: string;
  avatar?: string;
  username: string;
  TCIs?: ITCI[];
}

interface IUser {
  accessToken?: string;
  avatar?: string;
  email: string;
  isVerified?: boolean;
  password: string;
  username: string;
}

const login = async (event: { body: string }): Promise<IHTTP> => {
  const { email, password } = JSON.parse(event.body);

  try {
    const user = await loginUser(email);
    if (user instanceof Error) return createAWSResErr(404, 'Email address is not associated with any user');
    if (user.isVerified === false) return createAWSResErr(401, 'Email address is not verified');
    if (password !== user.password) return createAWSResErr(401, 'Password is incorrect');

    let newAccessToken: string;
    try {
      newAccessToken = (await verifyAccessToken(user.username, user.accessToken!)) as string;
    } catch (error) {
      return createAWSResErr(500, 'Error verifying / creating access token');
    }

    const userAvatar = await getUserAvatar(user.username);
    const TCIs = await getExistingTCI(dbClient, user.username);

    const payload: IPayload = { accessToken: newAccessToken, TCIs, username: user.username };
    if (userAvatar !== undefined) payload.avatar = userAvatar;

    console.log('Logged in successfully');
    return {
      statusCode: 200,
      body: JSON.stringify(payload)
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(404, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(login).use(cors());

const createNewAccessToken = async (username: string): Promise<string> => {
  const refreshedToken = await generateAccessToken();

  const params = createDynamoUpdateQuery(
    process.env.USER_TABLE_NAME!,
    'username',
    username,
    'S',
    'accessToken',
    JSON.stringify(refreshedToken),
    'S'
  );

  await dbClient.send(new UpdateItemCommand(params));
  return JSON.stringify(refreshedToken);
};

const getUserAvatar = async (username: string): Promise<string | undefined> => {
  const avatar = await getUserAvatarFromDB(dbClient, username);

  return avatar instanceof Error ? undefined : avatar;
};

const loginUser = async (email: string): Promise<Error | IUser> => {
  const query = createDynamoSearchQuery(
    process.env.USER_TABLE_NAME!,
    'accessToken, avatar, email, isVerified, password, username',
    'email',
    email,
    'S',
    'email'
  );
  try {
    const results = await dbClient.send(new QueryCommand(query));
    return unmarshall(results.Items![0]) as IUser;
  } catch (error) {
    return new Error();
  }
};

const verifyAccessToken = async (username: string, oldAccessToken: string): Promise<string | IHTTP> => {
  if (oldAccessToken === undefined) return await createNewAccessToken(username);

  const { accessTokenExpiry } = JSON.parse(oldAccessToken);
  if (accessTokenExpiry !== undefined && accessTokenExpiry > Date.now()) return oldAccessToken;

  return await createNewAccessToken(username);
};
