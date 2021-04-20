import middy from '@middy/core';
import cors from '@middy/http-cors';
import AWS, { DynamoDB } from 'aws-sdk';
import { createAWSResErr } from '../shared/functions/createAWSResErr';

const dynamodb = new AWS.DynamoDB.DocumentClient();

const getAllReviews = async () => {
  const params: DynamoDB.DocumentClient.ScanInput = {
    TableName: process.env.REVIEW_TABLE_NAME!
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
