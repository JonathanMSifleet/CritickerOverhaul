import { DynamoDBClient, PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb';

import IHTTP from '../shared/interfaces/IHTTP';
import cors from '@middy/http-cors';
import { createAWSResErr } from './../shared/functions/createAWSResErr';
import { marshall } from '@aws-sdk/util-dynamodb';
import middy from '@middy/core';
import { validateUserInputs } from '../shared/functions/validationFunctions';

const dbClient = new DynamoDBClient({});

const signup = async (event: { body: string }): Promise<IHTTP> => {
  const { username, email, password } = JSON.parse(event.body);

  const errors = await validateUserInputs(username, email, password);
  if (errors.length !== 0) return createAWSResErr(422, errors as string[]);

  let memberSince = Date.now();
  memberSince = Math.floor(memberSince / (24 * 60 * 60)) * 24 * 60 * 60;

  try {
    const result = await insertUserToDB(username, email, password, memberSince);

    console.log('Signed up successfully');
    return {
      statusCode: 201,
      body: JSON.stringify(result)
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const insertUserToDB = async (
  username: string,
  email: string,
  password: string,
  memberSince: number
): Promise<PutItemCommandOutput> => {
  const params = {
    TableName: process.env.USER_TABLE_NAME!,
    Item: marshall({
      email,
      username,
      password,
      memberSince,
      numRatings: 0
    }),
    ReturnConsumedCapacity: 'TOTAL'
  };

  return await dbClient.send(new PutItemCommand(params));
};

export const handler = middy(signup).use(cors());
