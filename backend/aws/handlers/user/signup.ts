import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { validateUserInputs } from '../../../../shared/functions/validationFunctions';
import cors from '@middy/http-cors';
import generateAccessToken from '../../shared/functions/generateAccessToken';
import IAccessToken from '../../../../shared/interfaces/IAccessToken';
import IHTTP from '../../shared/interfaces/IHTTP';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const signup = async (event: { body: string }): Promise<IHTTP> => {
  const { username, email, password } = JSON.parse(event.body);

  const errors = await validateUserInputs(username, email);
  if (errors.length !== 0) return createAWSResErr(422, errors as string[]);

  const memberSince = getSignupDate();
  const accessToken = (await generateAccessToken()) as IAccessToken;

  try {
    const result = await insertUserToDB(username, email, password, memberSince, accessToken);

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

export const handler = middy(signup).use(cors());

const getSignupDate = (): number => Math.floor(Date.now() / (24 * 60 * 60)) * 24 * 60 * 60;

const insertUserToDB = async (
  username: string,
  email: string,
  password: string,
  memberSince: number,
  accessToken: IAccessToken
): Promise<PutItemCommandOutput> => {
  const params = {
    TableName: process.env.USER_TABLE_NAME!,
    Item: marshall({
      email,
      username,
      password,
      memberSince,
      numRatings: 0,
      accessToken: JSON.stringify(accessToken)
    }),
    ReturnConsumedCapacity: 'TOTAL'
  };

  return await dbClient.send(new PutItemCommand(params));
};
