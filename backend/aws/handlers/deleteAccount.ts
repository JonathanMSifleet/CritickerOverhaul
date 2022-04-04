import {
  BatchWriteItemCommand,
  BatchWriteItemCommandOutput,
  DynamoDBClient,
  QueryCommand
} from '@aws-sdk/client-dynamodb';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import chunk from 'chunk';
import cors from '@middy/http-cors';
import createDynamoSearchQuery from '../shared/functions/DynamoDB/createDynamoSearchQuery';
import IHTTP from '../shared/interfaces/IHTTP';
import middy from '@middy/core';
import validateAccessToken from '../shared/functions/validateAccessToken';

const dbClient = new DynamoDBClient({});

interface IRating {
  imdbID: number;
  username: string;
}

const deleteAccount = async (event: {
  headers: { Authorization: string };
  pathParameters: { username: string };
}): Promise<IHTTP | undefined> => {
  const username = event.pathParameters.username;

  const accessToken = event.headers.Authorization.split(' ')[1];
  const validToken = await validateAccessToken(username, accessToken);
  if (validToken !== true) return createAWSResErr(401, 'Access token invalid');

  const ratings = await getRatings(username);
  if (ratings instanceof Error) return createAWSResErr(520, 'Error fetching ratings');

  await deleteRatings(username, ratings as IRating[]);
  if (ratings instanceof Error) return createAWSResErr(520, 'Error deleting ratings');
};

export const handler = middy(deleteAccount).use(cors());

const deleteRatings = async (username: string, ratings: IRating[]): Promise<IHTTP | void> => {
  const items = ratings.map((rating) => ({
    DeleteRequest: { Key: { imdbID: { N: rating.imdbID.toString() }, username: { S: username } } }
  }));

  const ratingChunks = chunk(items, 25);

  const deleteRequests: Promise<BatchWriteItemCommandOutput>[] = [];
  ratingChunks.forEach((ratingChunk) => {
    const params = {
      RequestItems: {
        [process.env.RATINGS_TABLE_NAME!]: ratingChunk
      }
    };
    deleteRequests.push(dbClient.send(new BatchWriteItemCommand(params)));
  });

  try {
    await Promise.all(deleteRequests);
    console.log('Sucessfully deleted ratings');
    return;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const getRatings = async (username: string): Promise<IHTTP | IRating[]> => {
  const query = createDynamoSearchQuery(
    process.env.RATINGS_TABLE_NAME!,
    'imdbID',
    'username',
    username,
    'S',
    'usernameRating'
  );

  try {
    const results = await dbClient.send(new QueryCommand(query));
    return results.Items!.map((result) => unmarshall(result) as IRating);
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};
