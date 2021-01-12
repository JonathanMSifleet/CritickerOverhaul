const middy = require('middy');
const cors = require('@middy/http-cors');
import { createAWSResErr } from '../util/createAWSResErr';
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function login(event: { body: string }, _context: any) {
  const { email, password } = JSON.parse(event.body);

  if (!email || !password) {
    return createAWSResErr(401, 'Please provide email and password!');
  }

  const params = {
    TableName: process.env.USER_TABLE_NAME,
    KeyConditionExpression: '#email = :email',
    ExpressionAttributeNames: {
      '#email': 'email'
    },
    ExpressionAttributeValues: {
      ':email': email
    }
  };

  try {
    const result = await dynamodb.query(params).promise();
    const user = result.Items[0];

    if (user === undefined) {
      return createAWSResErr(404, 'No user found with that email');
    }

    if (!(await verifyPassword(password, user.password))) {
      return createAWSResErr(401, 'Incorrect password');
    }

    return {
      statusCode: 201,
      body: JSON.stringify(user)
    };
  } catch (error) {
    return createAWSResErr(404, error);
  }
}

async function verifyPassword(candidatePassword: string, userPassword: string) {
  return bcrypt.compareSync(candidatePassword, userPassword);
}

export const handler = middy(login).use(cors());
