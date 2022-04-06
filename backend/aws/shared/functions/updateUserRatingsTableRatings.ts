import { createAWSResErr } from './createAWSResErr';
import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandOutput,
  PutItemCommand,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import IHTTP from '../interfaces/IHTTP';
import IRating from '../../../../shared/interfaces/IRating';

const updateUserRatingsTableRatings = async (
  dbClient: DynamoDBClient,
  username: string,
  payload: IRating
): Promise<IHTTP | void> => {
  const query = {
    TableName: process.env.USER_RATINGS_TABLE_NAME!,
    Key: {
      username: { S: username }
    }
  };

  const ratingsResult = await dbClient.send(new GetItemCommand(query));

  if (ratingsResult.Item === undefined) {
    const createResult = await createInitialUserRatingTableRating(dbClient, username, payload);
    if (createResult instanceof Error) return createAWSResErr(520, 'Error updating user-ratings-table ratings');
    if (createResult === null) return;
  }

  const updatedRatingResult = await createUpdatedUserRatingTableRating(dbClient, username, ratingsResult, payload);
  if (updatedRatingResult instanceof Error) return createAWSResErr(520, 'Error updating user-ratings-table ratings');
  if (updatedRatingResult === null) return;
};

export default updateUserRatingsTableRatings;

const createInitialUserRatingTableRating = async (
  dbClient: DynamoDBClient,
  username: string,
  payload: IRating
): Promise<IHTTP | void> => {
  const updatedPercentiles = marshall({
    username,
    ratings: JSON.stringify([{ imdbID: payload.imdbID, ratingPercentile: payload.ratingPercentile }])
  });

  try {
    await dbClient.send(
      new PutItemCommand({
        TableName: process.env.USER_RATINGS_TABLE_NAME!,
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
  dbClient: DynamoDBClient,
  username: string,
  ratingsResult: GetItemCommandOutput,
  payload: IRating
): Promise<IHTTP | void> => {
  const currentPercentiles = JSON.parse(unmarshall(ratingsResult.Item!).ratings);
  currentPercentiles.push({ imdbID: payload.imdbID, ratingPercentile: payload.ratingPercentile });

  const updateItemQuery = {
    TableName: process.env.USER_RATINGS_TABLE_NAME!,
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
