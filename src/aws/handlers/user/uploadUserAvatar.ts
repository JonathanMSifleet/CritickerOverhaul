import createAWSResErr from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import cors from '@middy/http-cors';
import IHTTP from '../../interfaces/IHTTP';
import middy from '@middy/core';
import validateAccessToken from '../../shared/functions/validateAccessToken';

const dbClient = new DynamoDBClient({});

const uploadUserAvatar = async (event: {
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
    const avatarResult = await uploadPicture(username, image);
    if (avatarResult instanceof Error) return createAWSResErr(500, 'Error uploading avatar');

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

export const handler = middy(uploadUserAvatar).use(cors());

const uploadPicture = async (username: string, image: string): Promise<void | IHTTP> => {
  const query = {
    TableName: process.env.USER_TABLE_NAME!,
    Key: {
      username: { S: username }
    },
    UpdateExpression: 'set avatar = :avatar',
    ExpressionAttributeValues: {
      ':avatar': { S: image }
    }
  };

  try {
    await dbClient.send(new UpdateItemCommand(query));
    return;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(520, 'Unhandled Exception');
};
