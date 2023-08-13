import createAWSResErr from '../../shared/functions/createAWSResErr';
import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandOutput,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
  UpdateItemCommandOutput
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import alterNumRatings from '../../shared/functions/alterNumRatings';
import cors from '@middy/http-cors';
import createDynamoSearchQuery from '../../shared/functions/queries/createDynamoSearchQuery';
import createDynamoUpdateQuery from '../../shared/functions/queries/createDynamoUpdateQuery';
import getUserRatings from '../../shared/functions/getUserRatings';
import IHTTP from '../../interfaces/IHTTP';
import IRating from '../../interfaces/IRating';
import middy from '@middy/core';
import percentRank from 'percentile-rank';
import validateAccessToken from '../../shared/functions/validateAccessToken';

const dbClient = new DynamoDBClient({});

const rateFilm = async (event: {
  body: string;
  headers: { Authorization: string };
  pathParameters: { username: string };
}): Promise<IHTTP> => {
  const { imdbID, reviewAlreadyExists } = JSON.parse(event.body);
  let { rating, review } = JSON.parse(event.body);
  const { username } = event.pathParameters;

  try {
    rating = rating.trim();
    review = review.trim();
    if (review.length === 0) review = null;
  } catch (error) {}

  const accessToken = event.headers.Authorization.split(' ')[1];

  const validToken = await validateAccessToken(dbClient, username, accessToken);
  if (validToken !== true) return createAWSResErr(401, 'Access token invalid');

  const payload: IRating = {
    username,
    createdAt: Date.now(),
    imdbID,
    rating
  };

  if (review) payload.review = review;

  try {
    const percentile = await getFilmWithSameRating(username, payload.rating);
    payload.ratingPercentile = (
      percentile instanceof Error ? await getPercentile(payload.rating, username) : percentile
    ) as number;

    const result = await insertRatingToDB(payload);
    if (result instanceof Error) return createAWSResErr(520, result.message);

    if (!reviewAlreadyExists) {
      const numRatings = (await alterNumRatings(dbClient, username, 1)) as number;

      if (numRatings % 25 === 0) await regeneratePercentiles(username);
    }

    await updateAggregatePercentiles(username, payload);

    return {
      statusCode: 201,
      body: JSON.stringify('Successfully inserted review')
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(520, 'Unhandled Exception');
};

export const handler = middy(rateFilm).use(cors());

const createInitialUserRatingTableRating = async (username: string, payload: IRating): Promise<IHTTP | void> => {
  const updatedPercentiles = marshall({
    username,
    ratings: JSON.stringify([{ imdbID: payload.imdbID, ratingPercentile: payload.ratingPercentile }])
  });

  try {
    await dbClient.send(
      new PutItemCommand({
        TableName: process.env.AGGREGATE_PERCENTILES_TABLE_NAME!,
        Item: updatedPercentiles
      })
    );

    console.log('Successfully updated user ratings table');
    return;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }
};

const createUpdatedUserRatingTableRating = async (
  username: string,
  ratingsResult: GetItemCommandOutput,
  payload: IRating
): Promise<IHTTP | void> => {
  const currentPercentiles = JSON.parse(unmarshall(ratingsResult.Item!).ratings);
  currentPercentiles.push({ imdbID: payload.imdbID, ratingPercentile: payload.ratingPercentile });

  const updateItemQuery = {
    TableName: process.env.AGGREGATE_PERCENTILES_TABLE_NAME!,
    Key: {
      username: { S: username }
    },
    UpdateExpression: 'set ratings = :ratings',
    ExpressionAttributeValues: {
      ':ratings': { S: JSON.stringify(currentPercentiles) }
    }
  };

  try {
    await dbClient.send(new UpdateItemCommand(updateItemQuery));

    console.log('Successfully update user-ratings-table-ratings');
    return;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }
};

const getPercentile = async (rating: number, username: string): Promise<number> => {
  const results = (await getUserRatings(dbClient, username, 'rating')) as IRating[];
  const ratings = results.map((result) => result.rating);

  return Math.round(percentRank(ratings, rating) * 100);
};

const getFilmWithSameRating = async (username: string, rating: number): Promise<IHTTP | { [key: string]: number }> => {
  const query = createDynamoSearchQuery(
    process.env.RATINGS_TABLE_NAME!,
    'ratingPercentile',
    'username',
    username,
    'S',
    'usernameRating',
    'rating',
    rating.toString(),
    'N'
  );
  query.Limit = 1;
  query.ScanIndexForward = false;
  query.KeyConditionExpression = 'username = :username AND rating <= :rating';

  try {
    const result = await dbClient.send(new QueryCommand(query));
    return unmarshall(result.Items![0]).ratingPercentile;
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

const regeneratePercentiles = async (username: string): Promise<IHTTP | void> => {
  const ratings = (await getUserRatings(dbClient, username, 'imdbID, rating')) as IRating[];
  const extractedRatings = ratings.map((rating) => rating.rating);

  const percentileRequests: Promise<UpdateItemCommandOutput>[] = [];
  ratings.forEach((rating) => {
    const percentile = Math.round(percentRank(extractedRatings, rating.rating) * 100);

    const params = createDynamoUpdateQuery(
      process.env.RATINGS_TABLE_NAME!,
      'imdbID',
      rating.imdbID.toString(),
      'N',
      'ratingPercentile',
      percentile.toString(),
      'N',
      'username',
      username,
      'S'
    );

    percentileRequests.push(dbClient.send(new UpdateItemCommand(params)));
  });

  try {
    await Promise.all(percentileRequests);
    console.log('Successfully regenerated percentiles');
    return;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const updateAggregatePercentiles = async (username: string, payload: IRating): Promise<IHTTP | void> => {
  const query = {
    TableName: process.env.AGGREGATE_PERCENTILES_TABLE_NAME!,
    Key: {
      username: { S: username }
    }
  };

  const ratingsResult = await dbClient.send(new GetItemCommand(query));

  if (ratingsResult.Item === undefined) {
    const createResult = await createInitialUserRatingTableRating(username, payload);
    if (createResult instanceof Error) return createAWSResErr(520, 'Error updating user-ratings-table ratings');
    if (createResult === null) return;
  }

  const updatedRatingResult = await createUpdatedUserRatingTableRating(username, ratingsResult, payload);
  if (updatedRatingResult instanceof Error) return createAWSResErr(520, 'Error updating user-ratings-table ratings');
  if (updatedRatingResult === null) return;
};
