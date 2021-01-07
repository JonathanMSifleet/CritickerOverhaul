import AWS from 'aws-sdk';
const dynamodb = new AWS.DynamoDB.DocumentClient();

import { createAWSResErr } from '../../util/createAWSResErr';

export async function getReviewBySlug(decodedSlug: string) {
  try {
    const params = {
      TableName: process.env.REVIEW_TABLE_NAME,
      Key: { slug: decodedSlug }
    };

    const result = await dynamodb.get(params).promise();
    return result.Item;
  } catch (error) {
    console.error(error);
    return createAWSResErr(404, error);
  }
}
