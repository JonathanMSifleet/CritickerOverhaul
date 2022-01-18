import middy from '@middy/core';
import cors from '@middy/http-cors';
import { AWSError } from 'aws-sdk';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import IHTTP from '../shared/interfaces/IHTTP';
import IHTTPErr from '../shared/interfaces/IHTTPErr';

const DB = new DynamoDB.DocumentClient();

const rateFilm = async (event: { body: string }): Promise<IHTTPErr | IHTTP> => {
  const { id, UID, rating, review } = JSON.parse(event.body);

  // const filmsJSON = await getCurrentFilms(id);

  let payload;

  if (review) {
    payload = {
      imdb_title_id: id,
      review: { UID, rating, review }
    };
  } else {
    payload = {
      imdb_title_id: id,
      review: { UID, rating }
    };
  }

  try {
    const result = await insertRatingToDB(payload);
    const incrementResult = await incrementRatings(UID);
    console.log('🚀 ~ file: rateFilm.ts ~ line 24 ~ rateFilm ~ incrementResult', incrementResult);

    console.log('Inserted rating successfully');
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

const insertRatingToDB = async (payload: {
  imdb_title_id: string;
  review: {
    UID: string;
    rating: number;
    review?: string;
  };
}): Promise<PromiseResult<DynamoDB.DocumentClient.PutItemOutput, AWSError>> => {
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.RATINGS_TABLE_NAME!,
    Item: payload,
    ReturnConsumedCapacity: 'TOTAL'
  };

  return await DB.put(params).promise();
};

const incrementRatings = async (
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
