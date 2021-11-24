import middy from '@middy/core';
import cors from '@middy/http-cors';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import IHTTP from '../shared/interfaces/IHTTP';
import IHTTPErr from '../shared/interfaces/IHTTPErr';

const DB = new DynamoDB.DocumentClient();

const rateFilm = async (event: { body: string }): Promise<IHTTPErr | IHTTP> => {
  const { id, username, rating, review } = JSON.parse(event.body);

  const payload = {
    imdb_title_id: id,
    username,
    rating,
    review
  };
  if (!review) delete payload.review;

  try {
    const result = await insertReviewToDB(payload);

    console.log('Inserted rating successfully');
    return {
      statusCode: 201,
      body: JSON.stringify(result)
    };
  } catch (e: any) {
    console.error(e);
    return createAWSResErr(520, e);
  }
};

const insertReviewToDB = async (payload: {
  imdb_title_id: string;
  username: string;
  rating: number;
  review?: string;
}) => {
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.RATINGS_TABLE_NAME!,
    Item: payload,
    ReturnConsumedCapacity: 'TOTAL'
  };

  return await DB.put(params).promise();
};

export const handler = middy(rateFilm).use(cors());
