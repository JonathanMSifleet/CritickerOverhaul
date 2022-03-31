import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import IHTTP from '../shared/interfaces/IHTTP';
import IRating from '../../../shared/interfaces/IRating';
import alterNumRatings from '../shared/functions/alterNumRatings';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from './../shared/functions/DynamoDB/createDynamoSearchQuery';
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

    await getAllRatings(payload.rating, username);

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

const getAllRatings = async (rating: number, username: string): Promise<void> => {
  const query = createDynamoSearchQuery(
    process.env.RATINGS_TABLE_NAME!,
    'rating',
    'username',
    username,
    'S',
    'usernameRating'
  );

  const results = await dbClient.send(new QueryCommand(query));

  const unmarshalledResults = results.Items!.map((result) => unmarshall(result));

  // calculate percentile of rating in unmarshalledResults[i].rating
  const percentile =
    unmarshalledResults.reduce((acc, curr) => {
      if (curr.rating === rating) return acc + 1;
      return acc;
    }, 0) / unmarshalledResults.length;

  console.log(percentile);
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
