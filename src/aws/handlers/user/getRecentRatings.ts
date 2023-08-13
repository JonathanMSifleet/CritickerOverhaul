import createAWSResErr from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import getUserRatings from '../../shared/functions/getUserRatings';
import IHTTP from '../../interfaces/IHTTP';
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

  const detailQueries: Promise<IHTTP | { [key: string]: number | string }>[] = [];
  dynamoRatings.forEach((rating) => {
    detailQueries.push(getFilmDetails(rating.imdbID));
  });

  const detailQueryResults = (await Promise.all(detailQueries)) as { [key: string]: number | string }[];

  const mergedResults = dynamoRatings.map((rating) => {
    const matchingResult = detailQueryResults.find((details) => details.imdbID === rating.imdbID);

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

export const handler = middy(getRecentRatings).use(cors());

const getFilmDetails = async (imdbID: number): Promise<IHTTP | { [key: string]: number | string }> => {
  const query = {
    TableName: process.env.FILMS_TABLE_NAME!,
    Key: {
      imdbID: { N: imdbID.toString() }
    },
    ProjectionExpression: 'imdbID, title, releaseYear'
  };

  try {
    const result = await dbClient.send(new GetItemCommand(query));
    return unmarshall(result.Item!);
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const getRecentRatingsFromDynamo = async (username: string): Promise<IHTTP | IRating[]> => {
  try {
    return (await getUserRatings(dbClient, username, 'imdbID, createdAt, rating, ratingPercentile', {
      ScanIndexForward: false,
      Limit: 24,
      IndexName: 'usernameCreatedAt'
    })) as IRating[];
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};
