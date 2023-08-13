import createAWSResErr from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import getUsername from '../../shared/functions/getUsername';
import IHTTP from '../../interfaces/IHTTP';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

interface IToken {
  expires: number;
  token: string;
}

const updatePassword = async (event: {
  body: string;
  pathParameters: { emailAddress: string; token: string };
}): Promise<IHTTP> => {
  const { emailAddress, token } = event.pathParameters;
  const password = JSON.parse(event.body).password;

  const username = await getUsername(dbClient, emailAddress);
  if (username instanceof Error) return createAWSResErr(404, 'Email address is not associated with any user');

  const dbToken = (await validateToken(username)) as IToken;
  if (dbToken instanceof Error) return createAWSResErr(500, 'Error getting existing token');
  if (dbToken.expires < Date.now()) return createAWSResErr(400, 'Token has expired');
  if (dbToken.token !== token) return createAWSResErr(400, 'Invalid token');

  try {
    await updatePasswordInDB(username, password);
    return { statusCode: 204 };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(updatePassword).use(cors());

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

const validateToken = async (username: string): Promise<IToken | Error> => {
  const query = {
    TableName: process.env.USER_TABLE_NAME!,
    Key: {
      username: { S: username }
    },
    ProjectionExpression: 'resetPasswordToken'
  };

  try {
    const results = await dbClient.send(new GetItemCommand(query));
    return JSON.parse(unmarshall(results.Item!).resetPasswordToken) as IToken;
  } catch (error) {
    return new Error();
  }
};
