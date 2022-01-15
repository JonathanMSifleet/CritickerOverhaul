import middy from '@middy/core';
import cors from '@middy/http-cors';
import S3 from 'aws-sdk/clients/s3';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import IHTTP from '../shared/interfaces/IHTTP';
import IHTTPErr from '../shared/interfaces/IHTTPErr';
const s3 = new S3();

export const uploadUserAvatar = async (event: {
  pathParameters: { UID: string };
  body: any;
}): Promise<IHTTPErr | IHTTP> => {
  const image = event.body.slice(1, -1);
  const filename = `${event.pathParameters.UID}.jpg`;

  try {
    const result = await uploadPicture(filename, image);
    return {
      statusCode: 200,
      body: JSON.stringify(`Found at: ${result}`)
    };
  } catch (error: unknown) {
    return createAWSResErr(500, error as string[]);
  }
};

const uploadPicture = async (filename: string, body: Buffer) => {
  const result = await s3
    .upload({
      Bucket: process.env.USER_AVATAR_BUCKET_NAME!,
      Key: filename,
      Body: body,
      ContentEncoding: 'base64',
      ContentType: 'image/jpg'
    })
    .promise();

  return result.Location;
};

export const handler = middy(uploadUserAvatar).use(cors());
