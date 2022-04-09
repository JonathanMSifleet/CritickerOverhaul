import { BatchGetItemCommand, DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import chunk from 'chunk';
import cors from '@middy/http-cors';
import createDynamoSearchQuery from '../../shared/functions/queries/createDynamoSearchQuery';
import IHTTP from '../../shared/interfaces/IHTTP';
import IRating from '../../../../shared/interfaces/IRating';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const getFilmRatings = async (event: {
  pathParameters: { imdbID: number; username?: string };
}): Promise<IHTTP | undefined> => {
  const { username, imdbID } = event.pathParameters;

  const ratings = await getFilmRatingsFromDB(imdbID);
  if (ratings instanceof Error) return createAWSResErr(500, 'Error retrieving ratings');
  if ((ratings as IRating[]).length === 0) return createAWSResErr(404, 'No ratings');

  if (username !== undefined) await getTCIs(username, ratings as IRating[]);

  return {
    statusCode: 200,
    body: JSON.stringify(ratings)
  };
};

export const handler = middy(getFilmRatings).use(cors());

const getFilmRatingsFromDB = async (imdbID: number): Promise<IRating[] | IHTTP> => {
  const query = createDynamoSearchQuery(
    process.env.RATINGS_TABLE_NAME!,
    'username, rating, ratingPercentile, review',
    'imdbID',
    imdbID,
    'N'
  );

  try {
    const results = await dbClient.send(new QueryCommand(query));

    console.log('Sucessfully fetched ratings');
    return results.Items!.map((result) => unmarshall(result)) as unknown as IRating[];
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const getTCIs = async (curUsername: string, ratings: IRating[]): Promise<IHTTP | void> => {
  const usernamePairs: string[] = [];

  const usernames = ratings.map((rating) => rating.username);

  usernames.forEach((username) => {
    username < curUsername
      ? usernamePairs.push(`${username}-${curUsername}`)
      : usernamePairs.push(`${curUsername}-${username}`);
  });

  const usernameItems = usernames.map((usernamePair) => ({ usernames: { S: usernamePair } }));
  const usernameItemBatch = chunk(usernameItems, 100);

  for await (const batch of usernameItemBatch) {
    const params = {
      RequestItems: {
        [process.env.TCI_TABLE_NAME!]: { Keys: batch }
      }
    };

    try {
      const result = await dbClient.send(new BatchGetItemCommand(params));
      console.log('🚀 ~ file: getFilmRatings.ts ~ line 77 ~ forawait ~ result', result);
    } catch (error) {
      if (error instanceof Error) return createAWSResErr(500, error.message);
    }
  }
};
