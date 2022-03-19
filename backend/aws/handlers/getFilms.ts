import IHTTP from '../shared/interfaces/IHTTP';
import { connectionDetails } from '../shared/constants/ConnectionDetails';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import middy from '@middy/core';
import serverlessMysql from 'serverless-mysql';

const mysql = serverlessMysql({ config: connectionDetails });

const getFilms = async (): Promise<IHTTP> => {
  const sql = 'SELECT imdb_title_id, title, description, year FROM films ORDER BY imdb_title_id DESC LIMIT 10';

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

export const handler = middy(getFilms).use(cors());
