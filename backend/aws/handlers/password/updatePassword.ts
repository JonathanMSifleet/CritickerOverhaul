import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, GetItemCommand, QueryCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import createDynamoSearchQuery from '../../shared/functions/queries/createDynamoSearchQuery';
import IHTTP from '../../shared/interfaces/IHTTP';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const updatePassword = async (event: {
  body: string;
  pathParameters: { emailAddress: string; token: string };
}): Promise<IHTTP> => {
  const { emailAddress, token } = event.pathParameters;
  const password = JSON.parse(event.body).password;

  const dbToken = await validateToken(emailAddress);
  if (dbToken instanceof Error) return createAWSResErr(500, 'Error getting existing token');
  if (dbToken !== token) return createAWSResErr(400, 'Invalid token');

  const username = await getUsername(emailAddress);
  if (username instanceof Error) return createAWSResErr(404, 'Email address is not associated with any user');

  try {
    await updatePasswordInDB(username, password);
    return { statusCode: 204 };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(updatePassword).use(cors());

const getUsername = async (email: string): Promise<string | Error> => {
  const query = createDynamoSearchQuery(process.env.USER_TABLE_NAME!, 'username', 'email', email, 'S', 'email');

  try {
    const results = await dbClient.send(new QueryCommand(query));
    return unmarshall(results.Items![0]).username;
  } catch (error) {
    return new Error();
  }
};

const updatePasswordInDB = async (username: string, password: string): Promise<void | Error> => {
  const query = {
    TableName: process.env.USER_TABLE_NAME!,
    Key: {
      username: { S: username }
    },
    UpdateExpression: 'set password = :password',
    ExpressionAttributeValues: {
      ':password': { S: password }
    },
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    await dbClient.send(new UpdateItemCommand(query));

    console.log('Password updated successfully');
    return;
  } catch (error) {
    return new Error();
  }
};

const validateToken = async (email: string): Promise<string | Error> => {
  const query = {
    TableName: process.env.RESET_PASSWORD_TOKENS_TABLE_NAME!,
    Key: {
      emailAddress: { S: email }
    },
    ProjectionExpression: 'token'
  };

  try {
    const results = await dbClient.send(new GetItemCommand(query));
    return unmarshall(results.Item!).token;
  } catch (error) {
    console.log('Token is invalid');
    return new Error();
  }
};
