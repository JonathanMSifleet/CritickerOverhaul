// import { createAWSResErr } from '../../utils/createAWSResErr';
const middy = require('middy');
const { cors } = require('middy/middlewares');
import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function signup(event, context) {

  const { username, firstName, email, password } = JSON.parse(event.body);

  const result = await insertUserToDB(username, firstName, email, password);

  return {
    statusCode: 201,
    body: JSON.stringify(result)
  };
}

async function insertUserToDB(username, firstName, email, password) {

  const params = {
    Item: {
      "username": username,
      "firstName": firstName,
      "email": email,
      "password": password
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: process.env.USER_TABLE_NAME
  };

  const result = await dynamodb.put(params).promise();
  return result.Attributes;

}

export const handler = middy(signup)
  .use(cors());
