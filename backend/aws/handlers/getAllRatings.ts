import { AttributeValue, BatchGetItemCommand, DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import chunk from 'chunk';
import { parse } from 'query-string';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from '../shared/functions/DynamoDB/createDynamoSearchQuery';
import IFilm from '../shared/interfaces/IFilm';
import IHTTP from '../shared/interfaces/IHTTP';

const dbClient = new DynamoDBClient({});

interface IExtractedLastEvaluatedKey {
  imdbID: { N: AttributeValue };
  username: { S: AttributeValue };
  rating: { N: AttributeValue };
}

interface ILastEvaluatedKey {
  [key: string]: AttributeValue;
}

const getAllRatings = async (event: {
  pathParameters: { username: string; lastEvaluatedKey?: string };
}): Promise<void | IHTTP> => {
  const { username } = event.pathParameters;

  const lastEvaluatedKey = getLastEvaluatedKey(event.pathParameters.lastEvaluatedKey!);

  try {
    const { dynamoRatings, dynamoLastEvaluatedKey } = (await getDynamoRatings(
      username,
      lastEvaluatedKey as ILastEvaluatedKey | undefined
    )) as {
      dynamoRatings: IFilm[];
      dynamoLastEvaluatedKey: ILastEvaluatedKey;
    };

    const results = await getResults(dynamoRatings);

    return {
      statusCode: 200,
      body: JSON.stringify({ results, lastEvaluatedKey: unmarshall(dynamoLastEvaluatedKey) })
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(getAllRatings).use(cors());

const batchGetFilmDetails = async (imdbIDs: number[]): Promise<any> => {
  const params = {
    RequestItems: {
      [process.env.FILMS_TABLE_NAME!]: {
        Keys: imdbIDs.map((imdbID) => ({ imdbID: { N: imdbID.toString() } })),
        ProjectionExpression: 'imdbID, countries, directors, genres, languages, releaseYear, title, writers'
      }
    }
  };

  try {
    const results = await dbClient.send(new BatchGetItemCommand(params));

    return results.Responses!.FilmsTable.map((result) => unmarshall(result));
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
      'imdbID, rating',
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

const getLastEvaluatedKey = (passedLastEvaluatedKey: string): IExtractedLastEvaluatedKey | undefined => {
  try {
    const lastEvaluatedKey = parse(passedLastEvaluatedKey) as unknown as ILastEvaluatedKey;

    return {
      imdbID: { N: lastEvaluatedKey.imdbID },
      username: { S: lastEvaluatedKey.username },
      rating: { N: lastEvaluatedKey.rating }
    };
  } catch (error) {
    return undefined;
  }
};

const getResults = async (dynamoRatings: IFilm[]): Promise<{ imdbID: number }[]> => {
  const extractedImdbIDs = dynamoRatings.map((film) => film.imdbID);
  const chunkedImdbIDs = chunk(extractedImdbIDs, 25);

  const filmQueries = [] as any[];

  chunkedImdbIDs.forEach((imdbIDChunk) => {
    filmQueries.push(batchGetFilmDetails(imdbIDChunk));
  });

  const filmData = await Promise.all(filmQueries);

  return await mergeResults(dynamoRatings, filmData.flat());
};

const mergeResults = async (
  dynamoRatings: { imdbID: number }[],
  filmData: { imdbID: number }[]
): Promise<{ imdbID: number }[]> =>
  dynamoRatings.map((dynamoRating) => {
    const matchingFilm = filmData.find((film) => film.imdbID === dynamoRating.imdbID);

    return { ...dynamoRating, ...matchingFilm };
  });
