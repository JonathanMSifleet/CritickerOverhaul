import { DynamoDBClient, PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import IHTTP from '../shared/interfaces/IHTTP';
const dbClient = new DynamoDBClient({});

export const uploadUserAvatar = async (event: {
  pathParameters: { UID: string };
  body: string;
}): Promise<IHTTP> => {
  const image = JSON.parse(event.body).image;
  const { UID } = event.pathParameters;

  try {
    try {
      await uploadPicture(UID, image);
    } catch (error) {
      if (error instanceof Error) return createAWSResErr(500, error.message);
    }

    return {
      statusCode: 200,
      body: JSON.stringify('Successfully uploaded image')
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Internal Server Error');
};

const uploadPicture = async (UID: string, image: string): Promise<PutItemCommandOutput | IHTTP> => {
  const params = {
    TableName: process.env.AVATAR_TABLE_NAME!,
    Item: marshall({
      UID,
      image
    }),
    ReturnConsumedCapacity: 'TOTAL'
  };

  return await dbClient.send(new PutItemCommand(params));
};

export const handler = middy(uploadUserAvatar).use(cors());
