import { AttributeValue, DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import createAWSResErr from '../../shared/functions/createAWSResErr';
import cors from '@middy/http-cors';
import IHTTP from '../../interfaces/IHTTP';
import middy from '@middy/core';
import validateAccessToken from '../../shared/functions/validateAccessToken';
import IUserProfile from '../../interfaces/IUserProfile';

const dbClient = new DynamoDBClient({});

interface IExpressionAttributeValues {
  [key: string]: AttributeValue;
}

const updateUserProfile = async (event: {
  body: string;
  headers: { Authorization: string };
  pathParameters: { username: string };
}): Promise<IHTTP> => {
  const { username } = event.pathParameters;
  const accessToken = event.headers.Authorization.split(' ')[1];

  const validToken = await validateAccessToken(dbClient, username, accessToken);
  if (validToken !== true) return createAWSResErr(401, 'Access token invalid');

  const { bio, country, dob, email, firstName, gender, lastName } = JSON.parse(event.body);
  const updatedDetails = {
    bio,
    country,
    dob,
    email,
    firstName,
    gender,
    lastName
  };

  Object.entries(updatedDetails).forEach((entry: (string | number)[]) => {
    // @ts-expect-error can be used as index on updatedDetails
    if (entry[1] === undefined) delete updatedDetails[entry[0]];
  });

  Object.keys(updatedDetails).forEach((key) => {
    // @ts-expect-error key can be used as index
    if (typeof updatedDetails[key] === 'string') updatedDetails[key] = updatedDetails[key].trim();
  });

  try {
    await updateProfileInDB(updatedDetails, username);

    return {
      statusCode: 200,
      body: JSON.stringify('Successfully updated profile')
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(updateUserProfile).use(cors());

const updateProfileInDB = async (payload: IUserProfile, username: string): Promise<IHTTP | void> => {
  const params = {
    TableName: process.env.USER_TABLE_NAME!,
    Key: { username: { S: username } },
    UpdateExpression: generateUpdateExpression(payload),
    ExpressionAttributeValues: generateExpressionAttributeValues(payload),
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    await dbClient.send(new UpdateItemCommand(params));
    console.log('Updated profile successfully');
    return;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const generateUpdateExpression = (payload: IUserProfile): string => {
  let updateExpression = 'SET ';
  Object.keys(payload).forEach((key) => (updateExpression += `${key} = :${key}, `));

  return updateExpression.slice(0, -2);
};

const generateExpressionAttributeValues = (payload: IUserProfile): IExpressionAttributeValues => {
  const expressionAttributeValues: IExpressionAttributeValues = {};

  Object.keys(payload).forEach((key) => {
    // @ts-expect-error key can be used as index on payload
    const value = payload[key];

    switch (typeof value) {
      case 'string':
        expressionAttributeValues[`:${key}`] = { S: value };
        break;
      case 'number':
        expressionAttributeValues[`:${key}`] = { N: value.toString() };
        break;
      case 'boolean':
        expressionAttributeValues[`:${key}`] = { BOOL: value };
        break;
    }
  });

  return expressionAttributeValues;
};
