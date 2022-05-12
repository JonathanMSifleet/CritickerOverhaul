import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import cors from '@middy/http-cors';
import getStream from 'get-stream';
import IHTTP from '../../shared/interfaces/IHTTP';
import middy from '@middy/core';

const s3Client = new S3Client({});

const getUserAvatarS3 = async (event: { pathParameters: { username: string } }): Promise<IHTTP> => {
  const { username } = event.pathParameters;

  try {
    const avatar = await getUserAvatarFromS3(username);
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

const getUserAvatarFromS3 = async (username: string): Promise<string | IHTTP | null> => {
  try {
    const params = {
      Bucket: process.env.USER_AVATAR_BUCKET_NAME!,
      Key: `${username}.jpg`
    };

    const result = await s3Client.send(new GetObjectCommand(params));

    // @ts-expect-error
    return await getStream(result.Body);
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(404, error.message);
  }

  return createAWSResErr(500, 'Internal Server Error');
};

export const handler = middy(getUserAvatarS3).use(cors());
