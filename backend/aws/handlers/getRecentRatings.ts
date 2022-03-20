import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

import IHTTP from '../shared/interfaces/IHTTP';
import { connectionDetails } from '../shared/constants/ConnectionDetails';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from './../shared/functions/DynamoDB/createDynamoSearchQuery';
import matchDynamoAndMudfootResults from '../shared/functions/matchDynamoAndMudfootResults';
import middy from '@middy/core';
import serverlessMysql from 'serverless-mysql';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const dbClient = new DynamoDBClient({});
const mysql = serverlessMysql({ config: connectionDetails });

interface IUnmarshalledRating {
  imdb_title_id: number;
  createdAt: number;
  rating: number;
  ratingPercentile: number;
}

const getRecentRatings = async (event: { pathParameters: { username: string } }): Promise<IHTTP> => {
  const { username } = event.pathParameters;

  const dynamoRatings = (await getRecentRatingsFromDynamo(username)) as IUnmarshalledRating[];

  const sql = 'SELECT title, year, imdb_title_id FROM films WHERE imdb_title_id = ?';

  // To do
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queries: any[] = [];

  dynamoRatings.forEach((rating) => {
    queries.push(mysql.query(sql, [rating.imdb_title_id]));
  });

  const mudfootResults = await Promise.all(queries);
  mysql.quit();

  const mergedRatings = matchDynamoAndMudfootResults(dynamoRatings, mudfootResults);

  return {
    statusCode: 200,
    body: JSON.stringify(mergedRatings)
  };
};

const getRecentRatingsFromDynamo = async (username: string): Promise<IHTTP | IUnmarshalledRating[]> => {
  // to do: figure out why ProjectionExpression causes error
  // imdb_title_id, createdAt, rating, ratingPercentile
  const query = createDynamoSearchQuery(
    process.env.RATINGS_TABLE_NAME!,
    undefined,
    'username',
    username,
    'S',
    'username'
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
