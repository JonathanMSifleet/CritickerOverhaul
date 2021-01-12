const middy = require('middy');
const cors = require('@middy/http-cors');
const AWS = require('aws-sdk');
import { createAWSResErr } from '../util/createAWSResErr';
const dynamodb = new AWS.DynamoDB.DocumentClient();

// const User = require('../../models/userModel');

async function deleteAccount(
  event: { requestContext: { authorizer: { email: string } } },
  _context: any
) {
  const { email } = event.requestContext.authorizer;

  const params = {
    TableName: process.env.USER_TABLE_NAME,
    Key: {
      email
    },
    ConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  };

  try {
    const result = await dynamodb.delete(params).promise();
    return {
      statusCode: 204,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error(error);
    return createAWSResErr(403, error);
  }
}

export const handler = middy(deleteAccount).use(cors());
