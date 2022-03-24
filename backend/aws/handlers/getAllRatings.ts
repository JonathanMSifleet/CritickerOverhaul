import { AttributeValue, BatchGetItemCommand, DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import chunk from 'chunk';
import { parse } from 'query-string';
import IFilm from '../../../shared/interfaces/IFilm';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from '../shared/functions/DynamoDB/createDynamoSearchQuery';
import IHTTP from '../shared/interfaces/IHTTP';

const dbClient = new DynamoDBClient({});

interface IExtractedLastEvaluatedKey {
  imdbID: { N: AttributeValue };
  username: { S: AttributeValue };
  rating: { N: AttributeValue };
}

interface IFilmDetails {
  [key: string]: string | number;
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

    console.log('Successfully fetched ratings');
    return {
      statusCode: 200,
      body: JSON.stringify({
        results,
        lastEvaluatedKey: dynamoLastEvaluatedKey === undefined ? undefined : unmarshall(dynamoLastEvaluatedKey)
      })
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(getAllRatings).use(cors());

const batchGetFilmDetails = async (imdbIDs: number[]): Promise<IFilmDetails[] | IHTTP> => {
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
      'imdbID, rating, ratingPercentile',
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
  if (passedLastEvaluatedKey === undefined) return undefined;

  const lastEvaluatedKey = parse(passedLastEvaluatedKey) as unknown as ILastEvaluatedKey;

  return {
    imdbID: { N: lastEvaluatedKey.imdbID },
    username: { S: lastEvaluatedKey.username },
    rating: { N: lastEvaluatedKey.rating }
  };
};

const getResults = async (dynamoRatings: IFilm[]): Promise<{ imdbID: number }[]> => {
  const extractedImdbIDs = dynamoRatings.map((film) => film.imdbID);
  const chunkedImdbIDs = chunk(extractedImdbIDs, 25);

  const filmQueries = [] as Promise<IFilmDetails[]>[];

  chunkedImdbIDs.forEach((imdbIDChunk) => {
    filmQueries.push(batchGetFilmDetails(imdbIDChunk) as Promise<IFilmDetails[]>);
  });

  const filmData = await Promise.all(filmQueries);

  // @ts-expect-error imdbID is defined in type
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
