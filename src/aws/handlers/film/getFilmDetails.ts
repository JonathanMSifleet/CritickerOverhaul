import createAWSResErr from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import createDynamoSearchQuery from '../../shared/functions/queries/createDynamoSearchQuery';
import IHTTP from '../../interfaces/IHTTP';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const getFilmDetails = async (event: { pathParameters: { imdbID: number } }): Promise<IHTTP> => {
  const imdbID = event.pathParameters.imdbID;

  try {
    const query = createDynamoSearchQuery(process.env.FILMS_TABLE_NAME!, undefined, 'imdbID', imdbID.toString(), 'N');
    const result = await dbClient.send(new QueryCommand(query));

    const film = unmarshall(result.Items![0]);

    console.log('Sucessfully fetched results');
    return {
      statusCode: 200,
      body: JSON.stringify(film)
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(getFilmDetails).use(cors());
