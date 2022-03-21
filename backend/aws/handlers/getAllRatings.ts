import { AttributeValue, DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

import IFilm from '../shared/interfaces/IFilm';
import IHTTP from '../shared/interfaces/IHTTP';
import { connectionDetails } from '../shared/constants/ConnectionDetails';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from '../shared/functions/DynamoDB/createDynamoSearchQuery';
import getIndividualFilmDetails from '../shared/functions/getIndividualFilmDetails';
import mergeDynamoAndMudfootResults from '../shared/functions/mergeDynamoAndMudfootResults';
import middy from '@middy/core';
import { parse } from 'query-string';
import serverlessMysql from 'serverless-mysql';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const mysql = serverlessMysql({ config: connectionDetails });
const dbClient = new DynamoDBClient({});

interface ILastEvaluatedKey {
  [key: string]: AttributeValue;
}

const getAllRatings = async (event: {
  pathParameters: { username: string; lastEvaluatedKey?: string };
}): Promise<void | IHTTP> => {
  const { username } = event.pathParameters;

  let lastEvaluatedKey = undefined;
  try {
    lastEvaluatedKey = parse(event.pathParameters.lastEvaluatedKey!);

    lastEvaluatedKey = {
      imdb_title_id: { N: lastEvaluatedKey.imdb_title_id },
      username: { S: lastEvaluatedKey.username },
      rating: { N: lastEvaluatedKey.rating }
    };
  } catch (error) {
    console.error(error);
  }

  try {
    const { dynamoRatings, dynamoLastEvaluatedKey } = (await getDynamoRatings(
      username,
      lastEvaluatedKey as ILastEvaluatedKey | undefined
    )) as {
      dynamoRatings: IFilm[];
      dynamoLastEvaluatedKey: ILastEvaluatedKey;
    };

    const filmQueries = [] as any[];

    dynamoRatings.forEach((rating: IFilm) => {
      filmQueries.push(getIndividualFilmDetails(rating.imdb_title_id, mysql, 'allRatings'));
    });

    const mudfootResults = await Promise.all(filmQueries);
    mysql.quit();

    const mergedResults = mergeDynamoAndMudfootResults(dynamoRatings, mudfootResults);

    return {
      statusCode: 200,
      body: JSON.stringify({ results: mergedResults, lastEvaluatedKey: unmarshall(dynamoLastEvaluatedKey) })
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const getDynamoRatings = async (
  username: string,
  lastEvaluatedKey?: ILastEvaluatedKey
): Promise<IHTTP | { dynamoRatings: IFilm[]; dynamoLastEvaluatedKey: ILastEvaluatedKey }> => {
  try {
    const query = createDynamoSearchQuery(
      process.env.RATINGS_TABLE_NAME!,
      'imdb_title_id, rating',
      'username',
      username,
      'S',
      'usernameRating'
    );
    query.ScanIndexForward = false;
    query.Limit = 60;

    if (lastEvaluatedKey) query.ExclusiveStartKey = lastEvaluatedKey;

    const result = await dbClient.send(new QueryCommand(query));
    return {
      dynamoRatings: result.Items!.map((item) => unmarshall(item)) as IFilm[],
      dynamoLastEvaluatedKey: result.LastEvaluatedKey!
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(getAllRatings).use(cors());
