import { AttributeValue, DynamoDBClient, ScanCommand, ScanCommandInput } from '@aws-sdk/client-dynamodb';
import createAWSResErr from '../../shared/functions/createAWSResErr';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import IHTTP from '../../interfaces/IHTTP';
import ISearchedFilm from '../../interfaces/ISearchedFilm';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

interface IPayload {
  films: ISearchedFilm[];
  LastEvaluatedKey: {
    [key: string]: AttributeValue;
  };
}

const searchForFilm = async (event: {
  pathParameters: { queryString: string; lastEvaluatedKey?: string };
}): Promise<IHTTP> => {
  let queryString = event.pathParameters.queryString;
  const lastEvaluatedKey = event.pathParameters.lastEvaluatedKey!;
  queryString = decodeURIComponent(queryString);

  const films = lastEvaluatedKey ? await queryDB(queryString, Number(lastEvaluatedKey)) : await queryDB(queryString);
  if (films instanceof Error) return createAWSResErr(500, 'Error getting films');

  return { statusCode: 200, body: JSON.stringify(films) };
};

export const handler = middy(searchForFilm).use(cors());

const queryDB = async (queryString: string, lastEvaluatedKey?: number): Promise<IHTTP | IPayload> => {
  const query: ScanCommandInput = {
    TableName: process.env.FILMS_TABLE_NAME!,
    FilterExpression: 'contains(#title, :title)',
    ExpressionAttributeNames: {
      '#title': 'title'
    },
    ExpressionAttributeValues: {
      ':title': { S: queryString }
    },
    ProjectionExpression: 'title, releaseYear, description, imdbID'
  };

  if (lastEvaluatedKey) query.ExclusiveStartKey = { imdbID: { N: lastEvaluatedKey.toString() } };

  try {
    const result = await dbClient.send(new ScanCommand(query));
    const unmarshalledFilms = result.Items!.map((film) => unmarshall(film)) as ISearchedFilm[];

    let lastEvaluatedKey = undefined;
    if (result.LastEvaluatedKey) lastEvaluatedKey = unmarshall(result.LastEvaluatedKey!).imdbID;

    return {
      films: unmarshalledFilms,
      LastEvaluatedKey: lastEvaluatedKey
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};
