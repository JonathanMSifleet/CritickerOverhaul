const middy = require('middy');
const cors = require('@middy/http-cors');
const AWS = require('aws-sdk');
import { createAWSResErr } from '../util/createAWSResErr';
const dynamodb = new AWS.DynamoDB.DocumentClient();

// const User = require('../../models/userModel');

async function deleteAccount(event, _context) {
  const { email } = event.requestContext.authorizer;

  console.log('user email', email);

  var params = {
    TableName: process.env.USER_TABLE_NAME,
    Key: {
      email: email
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
  } catch (e) {
    console.error(e);
    return createAWSResErr(403, e);
  }
}

export const handler = middy(deleteAccount).use(cors());
