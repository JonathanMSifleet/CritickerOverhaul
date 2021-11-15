import middy from '@middy/core';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import getUserAvatarFromS3 from '../shared/functions/getUserAvatarFromS3';
import IHTTP from '../shared/interfaces/IHTTP';
import IHTTPErr from '../shared/interfaces/IHTTPErr';

const getUserAvatar = async (event: {
  pathParameters: { username: string };
}): Promise<IHTTP | IHTTPErr> => {
  const { username } = event.pathParameters;

  try {
    const avatar = await getUserAvatarFromS3(username);
    if (!avatar) return createAWSResErr(404, '[Error goes here] ');

    return {
      statusCode: 200,
      body: JSON.stringify(avatar)
    };
  } catch (error: any) {
    return createAWSResErr(404, error);
  }
};

export const handler = middy(getUserAvatar).use(cors());
