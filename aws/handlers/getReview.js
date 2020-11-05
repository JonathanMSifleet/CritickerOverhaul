import AWS from 'aws-sdk';
// const middy = require('middy');
// const { cors } = require('middy/middlewares');
import { createAWSResErr } from '../../utils/createAWSResErr';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getReview(event, context) {

  // const { slug } = event.pathParameters;
  const slug = 'mass-effect-3';
  console.log(slug);

  const review = await getReviewBySlug(slug);
  console.log('review:', JSON.stringify(review));

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
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
    createAWSResErr(404, e);
  }

  return review;
};

export const handler = getReview; // middy(getReview)
  // .use(cors());
