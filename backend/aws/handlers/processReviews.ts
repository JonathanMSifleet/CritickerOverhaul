import {
  AttributeValue,
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  BatchWriteItemCommandOutput,
  DynamoDBClient
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import chunk from 'chunk';
import serverlessMysql from 'serverless-mysql';
import { connectionDetails } from '../shared/constants/ConnectionDetails';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import IHTTP from '../shared/interfaces/IHTTP';
import IProcessedReview from './../../../shared/interfaces/IProcessedReview';
const mysql = serverlessMysql({ config: connectionDetails });
const dbClient = new DynamoDBClient({});

const updateUserProfile = async (event: { body: string }): Promise<IHTTP> => {
  const reviews = JSON.parse(event.body);

  const matchedFilmIDs = await getMatchedFilmIDs(reviews);

  const filteredReviews = reviews.filter((review: { imdb_title_id: number }) =>
    matchedFilmIDs.includes(review.imdb_title_id)
  );

  const chunkedReviews = chunk(filteredReviews, 25) as IProcessedReview[][];

  try {
    const batchInserts = [] as Promise<BatchWriteItemCommandOutput | IHTTP>[];
    chunkedReviews.forEach(async (reviewChunk: IProcessedReview[]) => {
      batchInserts.push(batchInsertReviews(reviewChunk));
    });

    const results = await Promise.all(batchInserts);
    console.log('🚀 ~ file: processReviews.ts ~ line 38 ~ updateUserProfile ~ results', results);
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  try {
    return {
      statusCode: 200,
      body: JSON.stringify('')
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const getMatchedFilmIDs = async (reviews: { imdb_title_id: number }[]): Promise<number[]> => {
  const sql = 'SELECT imdb_title_id FROM films WHERE imdb_title_id = ?';

  const queries = [] as Promise<{ RowDataPacket: { imdb_title_id: number } }>[];
  reviews.forEach((review: { imdb_title_id: number }) =>
    queries.push(mysql.query(sql, [review.imdb_title_id]))
  );

  const results = await Promise.all(queries);
  mysql.quit();

  const matchedIDs = [] as number[];

  results.forEach((result) => {
    try {
      // @ts-expect-error 0 can be used as index
      matchedIDs.push(result[0].imdb_title_id);
    } catch (error) {}
  });

  return matchedIDs;
};

const batchInsertReviews = async (
  reviews: IProcessedReview[]
): Promise<BatchWriteItemCommandOutput | IHTTP> => {
  const items = [] as { PutRequest: { Item: { [key: string]: AttributeValue } } }[];

  reviews.forEach((review: IProcessedReview) =>
    items.push({ PutRequest: { Item: marshall(review) } })
  );

  const params = {
    RequestItems: {
      [process.env.RATINGS_TABLE_NAME as string]: items
    }
  } as BatchWriteItemCommandInput;

  try {
    const data = await dbClient.send(new BatchWriteItemCommand(params));
    return data;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(updateUserProfile).use(cors());
