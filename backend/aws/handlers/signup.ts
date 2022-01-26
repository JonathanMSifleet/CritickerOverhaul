import { DynamoDBClient, PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import shortUUID from 'short-uuid';
import { validateUserInputs } from '../shared/functions/validationFunctions';
import IHTTP from '../shared/interfaces/IHTTP';
import { createAWSResErr } from './../shared/functions/createAWSResErr';
const dbClient = new DynamoDBClient({});

const signup = async (event: { body: string }): Promise<IHTTP> => {
  const { username, email, password } = JSON.parse(event.body);

  const errors = await validateUserInputs(username, email, password);
  if (errors.length !== 0) return createAWSResErr(422, errors as string[]);

  // non-form attributes added here:
  const UID = shortUUID.generate();
  let memberSince = Date.now();
  memberSince = Math.floor(memberSince / (24 * 60 * 60)) * 24 * 60 * 60;

  try {
    const result = await insertUserToDB(username, email, password, UID, memberSince);

    console.log('Signed up successfully');
    return {
      statusCode: 201,
      body: JSON.stringify(result)
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Internal Server Error');
};

const insertUserToDB = async (
  username: string,
  email: string,
  password: string,
  UID: string,
  memberSince: number
): Promise<PutItemCommandOutput> => {
  const params = {
    TableName: process.env.USER_TABLE_NAME!,
    Item: marshall({
      UID,
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
