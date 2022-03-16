import { AttributeValue, DynamoDBClient, UpdateItemCommand, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';

import IHTTP from '../shared/interfaces/IHTTP';
import IUserProfile from './../../../shared/interfaces/IUserProfile';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

interface IExpressionAttributeValues {
  [key: string]: AttributeValue;
}

const updateUserProfile = async (event: { body: string }): Promise<IHTTP> => {
  const { country, email, firstName, gender, lastName, UID, username } = JSON.parse(event.body);

  try {
    try {
      await updateProfileInDB(
        {
          country,
          email,
          firstName,
          gender,
          lastName,
          username
        },
        UID
      );
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }

    return {
      statusCode: 200,
      body: JSON.stringify('Successfully updated profile')
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const updateProfileInDB = async (payload: IUserProfile, UID: string): Promise<IHTTP | void> => {
  const params = {
    TableName: process.env.USER_TABLE_NAME!,
    Key: {
      UID: {
        S: UID
      }
    },
    UpdateExpression: generateUpdateExpression(payload),
    ExpressionAttributeValues: generateExpressionAttributeValues(payload),
    ReturnValues: 'UPDATED_NEW'
  } as UpdateItemCommandInput;

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
  const expressionAttributeValues = {} as IExpressionAttributeValues;

  Object.keys(payload).forEach((key) => {
    // @ts-expect-error key can be used as index on payload
    const value = payload[key];
    switch (value) {
      case 'string':
        expressionAttributeValues[`:${key}`] = { S: value };
        break;
      case 'number':
        expressionAttributeValues[`:${key}`] = { N: value };
        break;
      case 'boolean':
        expressionAttributeValues[`:${key}`] = { BOOL: value };
        break;
    }
  });

  return expressionAttributeValues;
};

export const handler = middy(updateUserProfile).use(cors());
