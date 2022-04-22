import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import IHTTP from '../../shared/interfaces/IHTTP';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

interface IToken {
  token: string;
  expires: number;
}

const verifyPasswordResetToken = async (event: {
  pathParameters: { emailAddress: string; token: string };
}): Promise<IHTTP> => {
  const { emailAddress, token } = event.pathParameters;

  const dbToken = await getToken(emailAddress);
  if (dbToken instanceof Error) return createAWSResErr(500, 'Error getting token');
  if (dbToken.expires < Date.now()) return createAWSResErr(400, 'Token expired');
  if (dbToken.token !== token) return createAWSResErr(400, 'Invalid token');

  return {
    statusCode: 204
  };
};

export const handler = middy(verifyPasswordResetToken).use(cors());

const getToken = async (emailAddress: string): Promise<Error | IToken> => {
  const params = {
    TableName: process.env.RESET_PASSWORD_TOKENS_TABLE_NAME!,
    Key: {
      emailAddress: { S: emailAddress }
    },
    ProjectionExpression: '#token, expires',
    ExpressionAttributeNames: {
      '#token': 'token'
    }
  };

  try {
    const result = await dbClient.send(new GetItemCommand(params));
    return unmarshall(result.Item!) as IToken;
  } catch (error) {
    return new Error();
  }
};
