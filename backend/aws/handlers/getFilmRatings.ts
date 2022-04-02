import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

import IHTTP from '../shared/interfaces/IHTTP';
import IRating from '../../../shared/interfaces/IRating';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from '../shared/functions/DynamoDB/createDynamoSearchQuery';
import middy from '@middy/core';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const dbClient = new DynamoDBClient({});

const getFilmRatings = async (event: { pathParameters: { imdbID: number } }): Promise<IHTTP | undefined> => {
  const imdbID = event.pathParameters.imdbID;

  const ratings = await getFilmRatingsFromDB(imdbID);
  if (ratings instanceof Error) return createAWSResErr(500, 'Error retrieving ratings');

  if ((ratings as IRating[]).length === 0) return createAWSResErr(404, 'Error retrieving ratings');

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
