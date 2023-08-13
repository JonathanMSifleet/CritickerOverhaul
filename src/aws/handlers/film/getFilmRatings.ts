import createAWSResErr from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import createDynamoSearchQuery from '../../shared/functions/queries/createDynamoSearchQuery';
import IHTTP from '../../interfaces/IHTTP';
import IRating from '../../interfaces/IRating';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const getFilmRatings = async (event: { pathParameters: { imdbID: number } }): Promise<IHTTP> => {
  const { imdbID } = event.pathParameters;

  const ratings = await getFilmRatingsFromDB(imdbID);
  if (ratings instanceof Error) return createAWSResErr(500, 'Error retrieving ratings');
  if ((ratings as IRating[]).length === 0) return createAWSResErr(404, 'No ratings');

  return {
    statusCode: 200,
    body: JSON.stringify(ratings)
  };
};

export const handler = middy(getFilmRatings).use(cors());

const getFilmRatingsFromDB = async (imdbID: number): Promise<IRating[] | IHTTP> => {
  const query = createDynamoSearchQuery(
    process.env.RATINGS_TABLE_NAME!,
    'username, rating, ratingPercentile, review',
    'imdbID',
    imdbID,
    'N'
  );

  try {
    const results = await dbClient.send(new QueryCommand(query));

    console.log('Sucessfully fetched ratings');
    return results.Items!.map((result) => unmarshall(result)) as unknown as IRating[];
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};
