// import { catchAsyncErrors } from '../../utils/catchAsyncErrors';
// import { createAWSResErr } from '../../utils/createAWSResErr';
const middy = require('middy');
const { cors } = require('middy/middlewares');
import AWS from 'aws-sdk';
import { createAWSResErr } from '../../utils/createAWSResErr';
const dynamodb = new AWS.DynamoDB.DocumentClient();

// const User = require('../../models/userModel');

async function deleteAccount(event, context) {

  const { email } = event.requestContext.authorizer;

  console.log('user email', email);

  var params = {
    TableName: process.env.USER_TABLE_NAME,
    Key:{
        "email": email,
    },
    ConditionExpression:"email = :email",
    ExpressionAttributeValues: {
        ":email": email
    }
  };

  let result;
  try {
    result = await dynamodb.delete(params).promise();
  } catch ( e ) {
    console.error(e);
    createAWSResErr(404, e);
  }

  return {
    statusCode: 204,
    body: JSON.stringify(result)
  };
}

export const handler = middy(deleteAccount)
  .use(cors());