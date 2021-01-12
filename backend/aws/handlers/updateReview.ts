import AWS from 'aws-sdk';
const dynamodb = new AWS.DynamoDB.DocumentClient();
const middy = require('middy');
const cors = require('@middy/http-cors');
import { getReviewBySlug } from '../lib/review/getReviewBySlug';
import { createAWSResErr } from '../util/createAWSResErr';

export async function updateReview(
  _event: { pathParameters: { slug: string } },
  _context: any
) {
  //const { slug } = event.pathParameters;

  const slug = 'borderlands-3';
  const gameName = 'Test';

  try {
    let review = await getReviewBySlug(slug);
    if (review === undefined) {
      throw 'Invalid slug';
    }

    review = await updateReviewAttribute(slug, gameName);
    console.log("🚀 ~ file: updateReview.ts ~ line 24 ~ review", review)

    return {
      statusCode: 200,
      body: JSON.stringify(review)
    };
  } catch (errorMessage) {
    return createAWSResErr(404, errorMessage);
  }
}

async function updateReviewAttribute(slug: string, gameName: string) {
  const params = {
    TableName: process.env.REVIEW_TABLE_NAME,
    Key: { slug },
    UpdateExpression: `${gameName} = :${gameName}`,
    ExpressionAttributeValues: {
      ':gameName': gameName
    },
    ReturnValues: 'ALL_NEW'
  };

  const result = await dynamodb.update(params).promise();
  return result.Attributes;
}

export const handler = middy(updateReview).use(cors());
