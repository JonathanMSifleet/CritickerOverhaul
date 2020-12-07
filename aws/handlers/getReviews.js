import AWS from 'aws-sdk';
import { createAWSResErr } from '../util/createAWSResErr';
const middy = require('middy');
const { cors } = require('middy/middlewares');

// const AWS = AWSXRay.capture

// import getReviewsSchema from '../lib'
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getReviews() {

  let reviews;

  const params = {
    TableName: process.env.REVIEW_TABLE_NAME,
    IndexName: 'slug'
  };

  try {
    const result = await dynamodb.scan(params).promise();
    reviews = result.Items;
  } catch (e) {
    console.error(e);
    return createAWSResErr(404, e);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({reviews})
  };
};

export const handler = middy(getReviews)
  .use(cors());
