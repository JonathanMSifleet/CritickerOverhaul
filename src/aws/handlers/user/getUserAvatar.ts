import createAWSResErr from '../../shared/functions/createAWSResErr';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import cors from '@middy/http-cors';
import getUserAvatarFromDB from '../../shared/functions/getUserAvatarFromDB';
import IHTTP from '../../interfaces/IHTTP';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const getUserAvatar = async (event: { pathParameters: { username: string } }): Promise<IHTTP> => {
  const { username } = event.pathParameters;

  try {
    const avatar = await getUserAvatarFromDB(dbClient, username);
    if (avatar instanceof Error) return createAWSResErr(404, 'No avatar found');

    console.log('Successfully fetched user avatar');
    return {
      statusCode: 200,
      body: JSON.stringify({ username, avatar })
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(404, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(getUserAvatar).use(cors());
