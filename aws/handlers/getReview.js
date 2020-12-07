import AWS from 'aws-sdk';
const middy = require('middy');
const { cors } = require('middy/middlewares');
import { createAWSResErr } from '../util/createAWSResErr';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getReview(event, context) {

  const { slug } = event.pathParameters;
  const review = await getReviewBySlug(slug);

  return {
    statusCode: 200,
    body: JSON.stringify(review)
  };
}

export async function getReviewBySlugLocal(slug) {

  const decodedSlug = slug.slug;
  const review = await getReviewBySlug(decodedSlug);

  console.log('review:', review);
  return {
    statusCode: 200,
    body: JSON.stringify(review)
  };
}

async function getReviewBySlug(decodedSlug) {
  let review;

  console.log('decoded slug:', decodedSlug);

  try {
    const params = {
      TableName: process.env.REVIEW_TABLE_NAME,
      Key: { slug: decodedSlug }
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