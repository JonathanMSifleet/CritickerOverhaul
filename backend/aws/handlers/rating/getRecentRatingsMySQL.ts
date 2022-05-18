import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

import { connectionDetails } from '../../shared/constants/ConnectionDetails';
import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import createDynamoSearchQuery from '../../shared/functions/queries/createDynamoSearchQuery';
import IHTTP from '../../shared/interfaces/IHTTP';
import middy from '@middy/core';
import serverlessMysql from 'serverless-mysql';

const dbClient = new DynamoDBClient({});
const mysql = serverlessMysql({ config: connectionDetails });

interface IUnmarshalledRating {
  imdbID: number;
  createdAt: number;
  rating: number;
  ratingPercentile: number;
}

interface IResult {
  imdbID: number;
}

const getRecentRatings = async (event: { pathParameters: { username: string } }): Promise<IHTTP> => {
  const { username } = event.pathParameters;

  const dynamoRatings = (await getRecentRatingsFromDynamo(username)) as IUnmarshalledRating[];

  const sql = 'SELECT title, year, imdb_title_id FROM films WHERE imdb_title_id = ?';

  // To do
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queries: any[] = [];

  dynamoRatings.forEach((rating) => {
    queries.push(mysql.query(sql, [rating.imdbID]));
  });

  let mudfootResults = await Promise.all(queries);
  mysql.quit();

  mudfootResults = mudfootResults.map((result) => result[0]);

  const mergedRatings = mergeDynamoAndMudfootResults(dynamoRatings, mudfootResults);

  return {
    statusCode: 200,
    body: JSON.stringify(mergedRatings)
  };
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

const mergeDynamoAndMudfootResults = (dynamoResults: IResult[], mudfootResults: IResult[]): IResult[] =>
  dynamoResults.map((dynamoResult) => {
    const matchingResult = mudfootResults.find((mfResult: IResult) => mfResult.imdbID === dynamoResult.imdbID);

    return {
      ...dynamoResult,
      ...matchingResult
    };
  });

export const handler = middy(getRecentRatings).use(cors());
