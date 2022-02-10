import middy from '@middy/core';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import getUserAvatarFromDB from '../shared/functions/getUserAvatarFromDB';
import IHTTP from '../shared/interfaces/IHTTP';

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

  return createAWSResErr(500, 'Internal Server Error');
};

export const handler = middy(getUserAvatar).use(cors());
