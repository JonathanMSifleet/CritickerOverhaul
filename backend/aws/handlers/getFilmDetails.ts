import IHTTP from '../shared/interfaces/IHTTP';
import { connectionDetails } from '../shared/constants/ConnectionDetails';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import getIndividualFilmDetails from './../shared/functions/getIndividualFilmDetails';
import middy from '@middy/core';
import serverlessMysql from 'serverless-mysql';

const mysql = serverlessMysql({ config: connectionDetails });

const getFilmDetails = async (event: { pathParameters: { id: number } }): Promise<IHTTP> => {
  const { id } = event.pathParameters;

  try {
    const details = await getIndividualFilmDetails(id, mysql);
    mysql.quit();

    console.log('Sucessfully fetched results');
    return {
      statusCode: 200,
      body: JSON.stringify(details)
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(getFilmDetails).use(cors());
