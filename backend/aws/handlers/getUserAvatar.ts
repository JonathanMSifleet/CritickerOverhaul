import middy from '@middy/core';
import cors from '@middy/http-cors';
import { S3 } from 'aws-sdk';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import IHTTP from '../shared/interfaces/IHTTP';
import IHTTPErr from '../shared/interfaces/IHTTPErr';

const storage = new S3();

const getUserAvatar = async (event: { pathParameters: { UID: string } }): Promise<IHTTP | IHTTPErr> => {
  const { UID } = event.pathParameters;

  console.log('UID', UID);

  try {
    const avatar = await getUserAvatarFromS3(`${UID}.jpg`);
    if (!avatar) return createAWSResErr(404, 'No image found');

    return {
      statusCode: 200,
      body: JSON.stringify(avatar)
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(404, error.message);
  }

  return createAWSResErr(500, 'Internal Server Error');
};

const getUserAvatarFromS3 = async (filename: string): Promise<string | IHTTPErr | null> => {
  try {
    const params = {
      Bucket: process.env.USER_AVATAR_BUCKET_NAME!,
      Key: filename
    };

    const result = await storage.getObject(params).promise();
    return result.Body ? result.Body!.toString('utf-8') : null;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(404, error.message);
  }

  return createAWSResErr(500, 'Internal Server Error');
};

export const handler = middy(getUserAvatar).use(cors());
