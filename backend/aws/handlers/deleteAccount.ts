import middy from '@middy/core';
import cors from '@middy/http-cors';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { createAWSResErr } from '../shared/functions/createAWSResErr';

const DB = new DynamoDB.DocumentClient();

const deleteAccount = async (event: {
  requestContext: { authorizer: { email: string } };
}) => {
  const { email } = event.requestContext.authorizer;

  const params = {
    TableName: process.env.USER_TABLE_NAME!,
    ConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    },
    Key: {
      email
    }
  };

  try {
    const result = await DB.delete(params).promise();

    return {
      body: JSON.stringify(result),
      statusCode: 204
    };
  } catch (error: any) {
    return createAWSResErr(403, error);
  }
};

export const handler = middy(deleteAccount).use(cors());
