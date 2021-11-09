import middy from '@middy/core';
import cors from '@middy/http-cors';
import { DynamoDB } from 'aws-sdk';
import { createAWSResErr } from '../shared/functions/createAWSResErr';

const DB = new DynamoDB.DocumentClient();

const getAllReviews = async () => {
  const params: DynamoDB.DocumentClient.ScanInput = {
    TableName: process.env.REVIEW_TABLE_NAME!
  };

  try {
    const result = await DB.scan(params).promise();
    const reviews = result.Items;
    return {
      statusCode: 200,
      body: JSON.stringify({ reviews })
    };
  } catch (error: any) {
    return createAWSResErr(404, error);
  }
};

export const handler = middy(getAllReviews).use(cors());
