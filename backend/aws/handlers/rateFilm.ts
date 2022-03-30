import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

import IHTTP from '../shared/interfaces/IHTTP';
import IRating from '../../../shared/interfaces/IRating';
import alterNumRatings from '../shared/functions/alterNumRatings';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import { marshall } from '@aws-sdk/util-dynamodb';
import middy from '@middy/core';
import validateAccessToken from '../shared/functions/validateAccessToken';

const dbClient = new DynamoDBClient({});

const rateFilm = async (event: { body: string; pathParameters: { username: string } }): Promise<IHTTP> => {
  const { accessToken, imdbID, rating, review, reviewAlreadyExists } = JSON.parse(event.body);
  const { username } = event.pathParameters;

  const validToken = await validateAccessToken(username, accessToken);
  if (validToken !== true) return createAWSResErr(401, 'Access token invalid');

  const payload = {
    username,
    createdAt: Date.now(),
    imdbID,
    rating
  } as IRating;

  if (review) payload.review = review;

  try {
    await insertRatingToDB(payload);

    if (!reviewAlreadyExists) await alterNumRatings(username, 1);

    return {
      statusCode: 201,
      body: JSON.stringify('Successfully inserted review')
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const insertRatingToDB = async (payload: IRating): Promise<IHTTP | void> => {
  const params = {
    TableName: process.env.RATINGS_TABLE_NAME!,
    Item: marshall(payload),
    ReturnConsumedCapacity: 'TOTAL'
  };

  try {
    await dbClient.send(new PutItemCommand(params));
    console.log('Inserted rating successfully');
    return;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(rateFilm).use(cors());
