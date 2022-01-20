import middy from '@middy/core';
import cors from '@middy/http-cors';
import { AWSError } from 'aws-sdk';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import IReview from '../../../shared/interfaces/IReview';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import IHTTP from '../shared/interfaces/IHTTP';
import IHTTPErr from '../shared/interfaces/IHTTPErr';

const DB = new DynamoDB.DocumentClient();

const rateFilm = async (event: { body: string }): Promise<IHTTPErr | IHTTP> => {
  const payload = JSON.parse(event.body);

  console.log('review to be inserted', payload);

  try {
    const result = await insertRatingToDB(payload);
    console.log('Inserted rating successfully');

    await incrementUserRatings(payload.UID);
    console.log('Incremented num of user ratings successfully');

    return {
      statusCode: 201,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error(error);
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Internal Server Error');
};

const insertRatingToDB = async (
  payload: IReview
): Promise<PromiseResult<DynamoDB.DocumentClient.PutItemOutput, AWSError>> => {
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.RATINGS_TABLE_NAME!,
    Item: payload,
    ReturnConsumedCapacity: 'TOTAL'
  };

  return await DB.put(params).promise();
};

const incrementUserRatings = async (
  UID: string
): Promise<PromiseResult<DynamoDB.DocumentClient.UpdateItemOutput, AWSError>> => {
  const params = {
    TableName: process.env.USER_TABLE_NAME!,
    Key: { UID },
    UpdateExpression: 'SET #numRatings = #numRatings + :increase',
    ExpressionAttributeNames: {
      '#numRatings': 'numRatings'
    },
    ExpressionAttributeValues: {
      ':increase': 1
    },
    ReturnValues: 'ALL_NEW'
  };

  return await DB.update(params).promise();
};

export const handler = middy(rateFilm).use(cors());
