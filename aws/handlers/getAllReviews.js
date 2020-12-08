import AWS from 'aws-sdk';
import { createAWSResErr } from '../util/createAWSResErr';
const middy = require('middy');
const { cors } = require('middy/middlewares');

// const AWS = AWSXRay.capture

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAllReviews() {
  const params = {
    TableName: process.env.REVIEW_TABLE_NAME
  };

  try {
    const result = await dynamodb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    };
  } catch (e) {
    console.error(e);
    return createAWSResErr(404, e);
  }
};

export const handler = middy(getAllReviews)
  .use(cors());
