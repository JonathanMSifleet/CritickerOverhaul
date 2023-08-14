import createAWSResErr from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import IHTTP from '../../interfaces/IHTTP';
import middy from '@middy/core';
import { validateUserInputs } from '../../shared/functions/validationFunctions';
import bcrypt from 'bcryptjs';

const dbClient = new DynamoDBClient({});

const signup = async (event: { body: string }): Promise<IHTTP> => {
  const password = JSON.parse(event.body).password;
  let { username, email } = JSON.parse(event.body);

  username = username.trim();
  email = email.trim();

  const errors = await validateUserInputs(username, email);
  if (errors.length !== 0) return createAWSResErr(400, errors as string[]);

  const memberSince = getSignupDate();

  try {
    const salt = bcrypt.genSaltSync(10);
    await insertUserToDB(username, email, bcrypt.hashSync(password, salt), memberSince);

    console.log('Signed up successfully');

    return {
      statusCode: 201,
      body: JSON.stringify('Signup successful')
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(signup).use(cors());

const getSignupDate = (): number => Math.floor(Date.now() / (24 * 60 * 60)) * 24 * 60 * 60;

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
      isVerified: false,
      memberSince,
      numRatings: 0,
      password,
      username
    }),
    ReturnConsumedCapacity: 'TOTAL'
  };

  return await dbClient.send(new PutItemCommand(params));
};
