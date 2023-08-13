import createAWSResErr from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import createDynamoSearchQuery from '../../shared/functions/queries/createDynamoSearchQuery';
import IHTTP from '../../interfaces/IHTTP';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const getFilms = async (): Promise<IHTTP> => {
  const query = createDynamoSearchQuery(
    process.env.FILMS_TABLE_NAME!,
    'imdbID, title, description, releaseYear',
    'releaseYear',
    '2020',
    'N',
    'releaseYear'
  );
  query.Limit = 10;

  try {
    const results = await dbClient.send(new QueryCommand(query));
    const films = results.Items!.map((result) => unmarshall(result));

    console.log('Sucessfully fetched results');
    return {
      statusCode: 200,
      body: JSON.stringify(films)
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(getFilms).use(cors());
