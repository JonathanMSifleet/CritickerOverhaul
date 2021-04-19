import cors from '@middy/http-cors';
import AWS from 'aws-sdk';
import middy from 'middy';
import { createAWSResErr } from '../shared/createAWSResErr';

const dynamodb = new AWS.DynamoDB.DocumentClient();

const getAllReviews = async () => {
  const params = {
    TableName: process.env.REVIEW_TABLE_NAME
  };

  try {
    const result = await dynamodb.scan(params).promise();
    const reviews = result.Items;
    return {
      statusCode: 200,
      body: JSON.stringify({ reviews })
    };
  } catch (errorMessage) {
    return createAWSResErr(404, errorMessage);
  }
};

export const handler = middy(getAllReviews).use(cors());
