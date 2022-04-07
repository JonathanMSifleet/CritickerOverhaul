import { DynamoDBClient, PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb';

import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import cors from '@middy/http-cors';
import IHTTP from '../../shared/interfaces/IHTTP';
import middy from '@middy/core';
import validateAccessToken from '../../shared/functions/validateAccessToken';

const dbClient = new DynamoDBClient({});

export const uploadUserAvatar = async (event: {
  body: string;
  headers: { Authorization: string };
  pathParameters: { username: string };
}): Promise<IHTTP> => {
  const { username } = event.pathParameters;
  const accessToken = event.headers.Authorization.split(' ')[1];

  const validToken = await validateAccessToken(dbClient, username, accessToken);
  if (validToken !== true) return createAWSResErr(401, 'Access token invalid');

  const { image } = JSON.parse(event.body);

  try {
    await uploadPicture(username, image);

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
      username: { S: username },
      image: { S: image }
    },
    ReturnConsumedCapacity: 'TOTAL'
  };

  return await dbClient.send(new PutItemCommand(params));
};

export const handler = middy(uploadUserAvatar).use(cors());
