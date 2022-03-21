import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

import IFilm from '../shared/interfaces/IFilm';
import IHTTP from '../shared/interfaces/IHTTP';
import { connectionDetails } from '../shared/constants/ConnectionDetails';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from './../shared/functions/DynamoDB/createDynamoSearchQuery';
import getIndividualFilmDetails from '../shared/functions/getIndividualFilmDetails';
import mergeDynamoAndMudfootResults from '../shared/functions/mergeDynamoAndMudfootResults';
import middy from '@middy/core';
import serverlessMysql from 'serverless-mysql';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const mysql = serverlessMysql({ config: connectionDetails });
const dbClient = new DynamoDBClient({});

const getAllRatings = async (event: { pathParameters: { username: string } }): Promise<void | IHTTP> => {
  const { username } = event.pathParameters;

  try {
    const dynamoRatings = (await getDynamoRatings(username)) as IFilm[];

    const filmQueries = [] as any[];

    dynamoRatings.forEach((rating: IFilm) => {
      filmQueries.push(getIndividualFilmDetails(rating.imdb_title_id, mysql, 'allRatings'));
    });

    const mudfootResults = await Promise.all(filmQueries);
    mysql.quit();

    const mergedResults = mergeDynamoAndMudfootResults(dynamoRatings, mudfootResults);

    return {
      statusCode: 200,
      body: JSON.stringify(mergedResults)
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const getDynamoRatings = async (username: string): Promise<IHTTP | IFilm[]> => {
  try {
    // to do: figure out why ProjectionExpression causes error
    const query = createDynamoSearchQuery(
      process.env.RATINGS_TABLE_NAME!,
      undefined,
      'username',
      username,
      'S',
      'usernameRating'
    );
    query.ScanIndexForward = false;
    query.Limit = 50;

    const result = await dbClient.send(new QueryCommand(query));
    return result.Items!.map((item) => unmarshall(item)) as IFilm[];
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(getAllRatings).use(cors());
