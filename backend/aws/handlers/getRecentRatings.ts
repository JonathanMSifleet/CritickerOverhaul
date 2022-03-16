import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

import IHTTP from '../shared/interfaces/IHTTP';
import { connectionDetails } from '../shared/constants/ConnectionDetails';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import middy from '@middy/core';
import serverlessMysql from 'serverless-mysql';

const dbClient = new DynamoDBClient({});
const mysql = serverlessMysql({ config: connectionDetails });

interface IUnmarshalledRating {
  imdb_title_id: number;
  createdAt: number;
  rating: number;
  ratingPercentile: number;
}

const getRecentRatings = async (event: { pathParameters: { username: string } }): Promise<any> => {
  const { username } = event.pathParameters;

  const dynamoRatings = (await getRecentRatingsFromDynamo(username)) as IUnmarshalledRating[];

  const sql = 'SELECT title, year, imdb_title_id FROM films WHERE imdb_title_id = ?';

  // To do
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queries: any[] = [];

  dynamoRatings.forEach((rating) => {
    queries.push(mysql.query(sql, [rating.imdb_title_id]));
  });

  const results = await Promise.all(queries);
  mysql.quit();

  const mergedRatings = dynamoRatings.map((rating) => {
    const matchingResult = results.find((result) => result[0].imdb_title_id === rating.imdb_title_id);
    return matchingResult
      ? {
          ...rating,
          ...matchingResult[0]
        }
      : rating;
  });

  return {
    statusCode: 200,
    body: JSON.stringify(mergedRatings)
  };
};

const getRecentRatingsFromDynamo = async (username: string): Promise<IHTTP | IUnmarshalledRating[]> => {
  const params = {
    TableName: process.env.RATINGS_TABLE_NAME!,
    ProjectionExpression: 'imdb_title_id, createdAt, rating, ratingPercentile',
    FilterExpression: 'username = :username',
    ExpressionAttributeValues: {
      ':username': { S: username }
    }
  };

  try {
    const results = await dbClient.send(new ScanCommand(params));

    let unmarshalledResults = results.Items!.map((result) => {
      return {
        imdb_title_id: Number(result.imdb_title_id.N),
        createdAt: Number(result.createdAt.N),
        rating: Number(result.rating.N),
        ratingPercentile: Number(result.ratingPercentile.N)
      };
    }) as IUnmarshalledRating[];

    unmarshalledResults = unmarshalledResults.sort((a, b) => b.createdAt - a.createdAt);
    return unmarshalledResults.slice(0, 30);
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(getRecentRatings).use(cors());
