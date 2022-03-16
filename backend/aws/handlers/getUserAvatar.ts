import IHTTP from '../shared/interfaces/IHTTP';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import getUserAvatarFromDB from '../shared/functions/getUserAvatarFromDB';
import middy from '@middy/core';

const getUserAvatar = async (event: { pathParameters: { username: string } }): Promise<IHTTP> => {
  const { username } = event.pathParameters;

  try {
    const avatar = await getUserAvatarFromDB(username);
    if (!avatar) return createAWSResErr(404, 'No image found');

    console.log('Successfully fetched user avatar');
    return {
      statusCode: 200,
      body: JSON.stringify(avatar)
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(404, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(getUserAvatar).use(cors());
