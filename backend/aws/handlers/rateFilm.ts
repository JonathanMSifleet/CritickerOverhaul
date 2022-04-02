import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import IHTTP from '../shared/interfaces/IHTTP';
import IRating from '../../../shared/interfaces/IRating';
import alterNumRatings from '../shared/functions/alterNumRatings';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from './../shared/functions/DynamoDB/createDynamoSearchQuery';
import middy from '@middy/core';
import percentRank from 'percentile-rank';
import validateAccessToken from '../shared/functions/validateAccessToken';

const dbClient = new DynamoDBClient({});

const rateFilm = async (event: { body: string; pathParameters: { username: string } }): Promise<IHTTP> => {
  const { accessToken, imdbID, rating, review, reviewAlreadyExists } = JSON.parse(event.body);
  const { username } = event.pathParameters;

  const validToken = await validateAccessToken(username, accessToken);
  if (validToken !== true) return createAWSResErr(401, 'Access token invalid');

  const payload: IRating = {
    username,
    createdAt: Date.now(),
    imdbID,
    rating
  };

  if (review) payload.review = review;

  try {
    const percentile = await getPercentile(payload.rating, username);
    payload.ratingPercentile = percentile;

    await insertRatingToDB(payload);

    if (!reviewAlreadyExists) await alterNumRatings(dbClient, username, 1);

    return {
      statusCode: 201,
      body: JSON.stringify('Successfully inserted review')
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const getPercentile = async (rating: number, username: string): Promise<number> => {
  const query = createDynamoSearchQuery(
    process.env.RATINGS_TABLE_NAME!,
    'rating',
    'username',
    username,
    'S',
    'usernameRating'
  );

  const results = await dbClient.send(new QueryCommand(query));
  const unmarshalledResults = results.Items!.map((result) => unmarshall(result).rating);

  return Math.round(percentRank(unmarshalledResults, rating) * 100);
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
