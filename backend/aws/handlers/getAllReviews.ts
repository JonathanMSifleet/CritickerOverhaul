const AWS = require('aws-sdk');
import { createAWSResErr } from '../util/createAWSResErr';
const middy = require('middy');
const cors = require('@middy/http-cors');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAllReviews() {
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
}

export const handler = middy(getAllReviews).use(cors());
