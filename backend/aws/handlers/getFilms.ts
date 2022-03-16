import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

import IHTTP from '../shared/interfaces/IHTTP';
import { connectionDetails } from '../shared/constants/ConnectionDetails';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from './../shared/functions/DynamoDB/createDynamoSearchQuery';
import middy from '@middy/core';
import serverlessMysql from 'serverless-mysql';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const dbClient = new DynamoDBClient({});
const mysql = serverlessMysql({ config: connectionDetails });

const getFilms = async (event: { pathParameters: { page: string; UID: string } }): Promise<IHTTP> => {
  const { page, UID } = event.pathParameters;

  let sql = '';
  switch (page) {
    case 'home':
      sql = 'SELECT imdb_title_id, title, description, year FROM films ORDER BY imdb_title_id DESC LIMIT 10';
      break;
    case 'profile':
      await getRecentRatings(UID);
      process.exit();
      break;
  }

  try {
    const result = await mysql.query(sql, null);
    mysql.quit();

    console.log('Sucessfully fetched results');
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const getRecentRatings = async (UID: string): Promise<any> => {
  // replace with batch get items:
  const query = createDynamoSearchQuery(
    process.env.RATINGS_TABLE_NAME!,
    'imdb_title_id, createdAt, rating, ratingPercentile',
    'UID',
    UID,
    'S',
    'createdAt'
  );

  query.ScanIndexForward = false;
  console.log('🚀 ~ file: getFilms.ts ~ line 53 ~ getRecentRatings ~ query', query);

  try {
    const result = await dbClient.send(new QueryCommand(query));
    // @ts-expect-error
    console.log('🚀 ~ file: getFilms.ts ~ line 57 ~ getRecentRatings ~ result', unmarshall(result.Items));
  } catch (error) {
    console.error(error);
  }
};

export const handler = middy(getFilms).use(cors());
