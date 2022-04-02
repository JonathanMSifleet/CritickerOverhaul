import { DynamoDBClient, QueryCommand, QueryCommandOutput } from '@aws-sdk/client-dynamodb';

import IHTTP from '../shared/interfaces/IHTTP';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from './../shared/functions/DynamoDB/createDynamoSearchQuery';
import middy from '@middy/core';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const dbClient = new DynamoDBClient({});

interface IUnmarshalledRating {
  imdbID: number;
  createdAt: number;
  rating: number;
  ratingPercentile: number;
}

const getRecentRatings = async (event: { pathParameters: { username: string } }): Promise<IHTTP> => {
  const { username } = event.pathParameters;

  const dynamoRatings = (await getRecentRatingsFromDynamo(username)) as IUnmarshalledRating[];

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

const getRecentRatingsFromDynamo = async (username: string): Promise<IHTTP | IUnmarshalledRating[]> => {
  const query = createDynamoSearchQuery(
    process.env.RATINGS_TABLE_NAME!,
    'imdbID, createdAt, rating, ratingPercentile',
    'username',
    username,
    'S',
    'usernameCreatedAt'
  );
  query.ScanIndexForward = false;
  query.Limit = 20;

  try {
    const results = await dbClient.send(new QueryCommand(query));

    return results.Items!.map((result) => unmarshall(result)) as IUnmarshalledRating[];
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(getRecentRatings).use(cors());
