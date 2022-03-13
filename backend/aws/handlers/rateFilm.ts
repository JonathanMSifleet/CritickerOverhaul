import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import alterNumRatings from '../shared/functions/alterNumRatings';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import IHTTP from '../shared/interfaces/IHTTP';
const dbClient = new DynamoDBClient({});

interface IReview {
  imdb_title_id: number;
  UID: string;
  review: {
    rating: number;
    reviewText?: string;
  };
  createdAt: number;
}

const rateFilm = async (event: { body: string }): Promise<IHTTP> => {
  const { imdb_title_id, UID, review } = JSON.parse(event.body);

  const payload = {
    imdb_title_id,
    UID,
    review,
    createdAt: Date.now()
  };

  try {
    await insertRatingToDB(payload);
    await alterNumRatings(UID, true);

    return {
      statusCode: 201,
      body: JSON.stringify('Successfully inserted review')
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Internal Server Error');
};

const insertRatingToDB = async (payload: IReview): Promise<IHTTP | void> => {
  console.log('🚀 ~ file: rateFilm.ts ~ line 46 ~ insertRatingToDB ~ payload', payload);
  const params = {
    TableName: process.env.RATINGS_TABLE_NAME!,
    Item: marshall(payload),
    ReturnConsumedCapacity: 'TOTAL'
  } as PutItemCommandInput;

  try {
    await dbClient.send(new PutItemCommand(params));
    console.log('Inserted rating successfully');
    return;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Internal Server Error');
};

export const handler = middy(rateFilm).use(cors());
