import AWS from 'aws-sdk';
const middy = require('middy');
const { cors } = require('middy/middlewares');
import { createAWSResErr } from '../util/createAWSResErr';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getReview(event, context) {

  const { slug } = event.pathParameters;

  const review = await getReviewBySlug(slug);

  return {
    statusCode: 200,
    body: JSON.stringify(review)
  };
}

async function getReviewBySlug(slug) {

  let review;
  try {

    const params = {
      TableName: process.env.REVIEW_TABLE_NAME,
      Key: {
        slug: slug
      }
    };

    const result = await dynamodb.get(params).promise();
    review = result.Item;
  } catch (e) {
    console.error(e);
    return createAWSResErr(404, e);
  }

  return review;
};

export const handler = middy(getReview)
  .use(cors());