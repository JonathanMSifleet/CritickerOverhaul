import middy from '@middy/core';
import cors from '@middy/http-cors';
import serverlessMysql from 'serverless-mysql';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import IHTTP from '../shared/interfaces/IHTTP';
import IHTTPErr from '../shared/interfaces/IHTTPErr';
import { connectionDetails } from '../shared/MySQL/ConnectionDetails';
const mysql = serverlessMysql({ config: connectionDetails });

const getFilms = async (event: { pathParameters: { page: string } }): Promise<IHTTP | IHTTPErr> => {
  const { page } = event.pathParameters;
  let sql;

  switch (page) {
    case 'home':
      // eslint-disable-next-line max-len
      sql = `SELECT (imdb_title_id, title, description) FROM films ORDER BY imdb_title_id DESC LIMIT 10`;
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

  return createAWSResErr(500, 'Internal Server Error');
};

export const handler = middy(getFilms).use(cors());
