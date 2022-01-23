import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import getStream from 'get-stream';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import IHTTP from '../shared/interfaces/IHTTP';
import IHTTPErr from '../shared/interfaces/IHTTPErr';
const s3Client = new S3Client({});

const getUserAvatar = async (event: {
  pathParameters: { UID: string };
}): Promise<IHTTP | IHTTPErr> => {
  const { UID } = event.pathParameters;

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

    const result = s3Client.send(new GetObjectCommand(params));

    // @ts-expect-error is compatible
    const stream = await getStream(result.Body);
    return JSON.parse(`{${stream}}`).base64;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(404, error.message);
  }

  return createAWSResErr(500, 'Internal Server Error');
};

export const handler = middy(getUserAvatar).use(cors());
