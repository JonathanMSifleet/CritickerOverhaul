import { createAWSResErr } from '../shared/functions/createAWSResErr';
import cors from '@middy/http-cors';
import getUserAvatarFromDB from '../shared/functions/getUserAvatarFromDB';
import IHTTP from '../shared/interfaces/IHTTP';
import middy from '@middy/core';

const getUserAvatar = async (event: { pathParameters: { username: string } }): Promise<IHTTP> => {
  const { username } = event.pathParameters;

  try {
    const avatar = await getUserAvatarFromDB(username);
    if (avatar instanceof Error) return createAWSResErr(404, 'No avatar found');

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
