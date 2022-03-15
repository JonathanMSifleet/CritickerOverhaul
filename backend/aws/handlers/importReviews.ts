import {
  AttributeValue,
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  BatchWriteItemCommandOutput,
  DynamoDBClient,
  QueryCommand,
  UpdateItemCommand,
  UpdateItemCommandInput
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import chunk from 'chunk';
import serverlessMysql from 'serverless-mysql';
import IReview from '../../../shared/interfaces/IReview';
import { connectionDetails } from '../shared/constants/ConnectionDetails';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import IHTTP from '../shared/interfaces/IHTTP';
import createDynamoSearchQuery from './../shared/functions/createDynamoSearchQuery';
const mysql = serverlessMysql({ config: connectionDetails });
const dbClient = new DynamoDBClient({});

const importReviews = async (event: { body: string }): Promise<IHTTP> => {
  const { reviews, UID } = JSON.parse(event.body);

  const matchedFilmIDs = await getMatchedFilmIDs(reviews);
  const filteredReviews = reviews.filter((review: { imdb_title_id: number }) =>
    matchedFilmIDs.includes(review.imdb_title_id)
  );
  const chunkedReviews = chunk(filteredReviews, 25) as IReview[][];

  try {
    const batchInserts = [] as Promise<BatchWriteItemCommandOutput | IHTTP>[];
    chunkedReviews.forEach(async (reviewChunk: IReview[]) => {
      batchInserts.push(batchInsertReviews(reviewChunk));
    });

    await Promise.all(batchInserts);
    console.log(`Successfully inserted ${filteredReviews.length} reviews`);

    const numRatings = await getNumUserRatings(UID);
    await updateUserRatings(UID, numRatings as number);

    return {
      statusCode: 200,
      body: JSON.stringify(
        `Inserted ${filteredReviews.length} out of ${reviews.length} reviews. Success rate: ${(
          100 -
          ((filteredReviews.length - reviews.length) / reviews.length) * -100
        ).toFixed(2)}%`
      )
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const batchInsertReviews = async (
  reviews: IReview[]
): Promise<BatchWriteItemCommandOutput | IHTTP> => {
  const items = [] as { PutRequest: { Item: { [key: string]: AttributeValue } } }[];

  reviews.forEach((review: IReview) => items.push({ PutRequest: { Item: marshall(review) } }));

  const params = {
    RequestItems: {
      [process.env.RATINGS_TABLE_NAME as string]: items
    }
  } as BatchWriteItemCommandInput;

  try {
    return await dbClient.send(new BatchWriteItemCommand(params));
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

const getNumUserRatings = async (UID: string): Promise<number | IHTTP> => {
  const query = createDynamoSearchQuery(
    process.env.RATINGS_TABLE_NAME!,
    'UID',
    'UID',
    UID,
    'S',
    'UID',
    undefined,
    undefined,
    undefined
  );
  delete query['ProjectionExpression'];
  query['Select'] = 'COUNT';

  try {
    const result = await dbClient.send(new QueryCommand(query));
    return result.Count!;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled exception');
};

const updateUserRatings = async (UID: string, numRatings: number): Promise<IHTTP | void> => {
  const params = {
    TableName: process.env.USER_TABLE_NAME!,
    Key: {
      UID: { S: UID }
    },
    ExpressionAttributeValues: {
      ':numRatings': { N: numRatings.toString() }
    },
    UpdateExpression: 'set numRatings = :numRatings',
    ReturnValues: 'UPDATED_NEW'
  } as UpdateItemCommandInput;

  try {
    await dbClient.send(new UpdateItemCommand(params));
    console.log('Updated number of ratings successfully');
    return;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(importReviews).use(cors());
