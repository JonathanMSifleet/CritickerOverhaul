import AWS from 'aws-sdk';
import createError from 'http-errors';
const middy = require('middy');
const { cors } = require('middy/middlewares');

// import getReviewsSchema from '../lib'
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getReviews(event, context) {

  let reviews;

  const params = {
    TableName: process.env.REVIEW_TABLE_NAME,
    IndexName: 'reviewTitle'
    // KeyConditionExpression: '#id !== :id',
    // ExpressionAttributeValues: {
    //   ':id': '',
    // },
    // ExpressionAttributeNames: {
    //   '#id': 'id'
    // }
  };

  try {
    const result = await dynamodb.scan(params).promise();

    reviews = result.Items;
  } catch (e) {
    console.error(e);
    throw new createError.InternalServerError(e);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({reviews})
  };
};

export const handler = middy(getReviews)
  .use(cors());
