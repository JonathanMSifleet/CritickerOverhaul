import { DynamoDBClient, QueryCommand, QueryCommandOutput } from '@aws-sdk/client-dynamodb';

import { createAWSResErr } from '../shared/functions/createAWSResErr';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import createDynamoSearchQuery from '../shared/functions/queries/createDynamoSearchQuery';
import getUserRatings from '../shared/functions/getUserRatings';
import IHTTP from '../shared/interfaces/IHTTP';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

interface IRating {
  imdbID: number;
  createdAt: number;
  rating: number;
  ratingPercentile: number;
}

const getRecentRatings = async (event: { pathParameters: { username: string } }): Promise<IHTTP> => {
  const { username } = event.pathParameters;

  const dynamoRatings = (await getRecentRatingsFromDynamo(username)) as IRating[];

  const detailQueries: Promise<IHTTP | QueryCommandOutput>[] = [];
  dynamoRatings.forEach((rating) => {
    detailQueries.push(getFilmDetails(rating.imdbID));
  });

  const detailQueryResults = (await Promise.all(detailQueries)) as QueryCommandOutput[];

  let extractedFilmDetails: { [key: string]: any }[] = [];
  try {
    extractedFilmDetails = detailQueryResults.map((result) => unmarshall(result.Items![0]));
  } catch (error) {
    return createAWSResErr(404, 'No films found');
  }

  const mergedResults = dynamoRatings.map((rating) => {
    const matchingResult = extractedFilmDetails.find((details) => details.imdbID === rating.imdbID);

    return {
      ...rating,
      ...matchingResult
    };
  });

  console.log('Successfully fetched recent ratings');

  return {
    statusCode: 200,
    body: JSON.stringify(mergedResults)
  };
};

const getFilmDetails = async (imdbID: number): Promise<IHTTP | QueryCommandOutput> => {
  const query = createDynamoSearchQuery(
    process.env.FILMS_TABLE_NAME!,
    'imdbID, title, releaseYear',
    'imdbID',
    imdbID.toString(),
    'N'
  );

  try {
    return await dbClient.send(new QueryCommand(query));
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const getRecentRatingsFromDynamo = async (username: string): Promise<IHTTP | IRating[]> => {
  try {
    return (await getUserRatings(dbClient, username, 'imdbID, createdAt, rating, ratingPercentile', {
      ScanIndexForward: false,
      Limit: 20
    })) as IRating[];
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(getRecentRatings).use(cors());
