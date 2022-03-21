import { AttributeValue, DynamoDBClient, PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb';

import IHTTP from '../shared/interfaces/IHTTP';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

export const uploadUserAvatar = async (event: {
  pathParameters: { username: string };
  body: string;
}): Promise<IHTTP> => {
  const image = JSON.parse(event.body).image;
  const { username } = event.pathParameters;

  try {
    try {
      await uploadPicture(username, image);
    } catch (error) {
      if (error instanceof Error) return createAWSResErr(500, error.message);
    }

    console.log('Successfully uploaded image');
    return {
      statusCode: 200,
      body: JSON.stringify('Successfully uploaded image')
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

const uploadPicture = async (username: string, image: string): Promise<PutItemCommandOutput | IHTTP> => {
  const params = {
    TableName: process.env.AVATAR_TABLE_NAME!,
    Item: {
      username: { S: username } as AttributeValue,
      image: { B: image } as unknown as AttributeValue
    },
    ReturnConsumedCapacity: 'TOTAL'
  };

  return await dbClient.send(new PutItemCommand(params));
};

export const handler = middy(uploadUserAvatar).use(cors());
