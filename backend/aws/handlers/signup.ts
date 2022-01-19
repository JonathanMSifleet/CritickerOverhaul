import middy from '@middy/core';
import cors from '@middy/http-cors';
import { AWSError } from 'aws-sdk';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import shortUUID from 'short-uuid';
import { checkUniqueAttribute, validateUserInputs } from '../shared/functions/validationFunctions';
import IHTTP from '../shared/interfaces/IHTTP';
import IHTTPErr from '../shared/interfaces/IHTTPErr';
import { createAWSResErr } from './../shared/functions/createAWSResErr';

const DB = new DynamoDB.DocumentClient();

const signup = async (event: { body: string }): Promise<IHTTPErr | IHTTP> => {
  const { username, email, password } = JSON.parse(event.body);

  if (await checkUniqueAttribute('email', email))
    return createAWSResErr(403, 'Email already in use');
  if (await checkUniqueAttribute('username', username))
    return createAWSResErr(403, 'Username already in use');

  const errors = (await validateUserInputs(username, email, password)) as string[];

  if (errors.length !== 0) return createAWSResErr(422, errors);

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
): Promise<PromiseResult<DynamoDB.DocumentClient.PutItemOutput, AWSError>> => {
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.USER_TABLE_NAME!,
    Item: {
      UID,
      email,
      username,
      password,
      memberSince,
      numRatings: 0
    },
    ReturnConsumedCapacity: 'TOTAL'
  };

  return await DB.put(params).promise();
};

export const handler = middy(signup).use(cors());
