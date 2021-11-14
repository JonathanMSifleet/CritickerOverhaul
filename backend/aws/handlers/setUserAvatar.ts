import middy from '@middy/core';
import cors from '@middy/http-cors';
import S3 from 'aws-sdk/clients/s3';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import IHTTP from '../shared/interfaces/IHTTP';
import IHTTPErr from '../shared/interfaces/IHTTPErr';
const s3 = new S3();

export const setUserAvatar = async (event: {
  pathParameters: { UID: string };
  body: string;
}): Promise<IHTTPErr | IHTTP> => {
  const filename = `${event.pathParameters.UID}.jpg`;
  try {
    await deletePicture(filename);
    const buffer = await prepareImage(event.body);
    const result = await uploadPicture(filename, buffer);
    return {
      statusCode: 200,
      body: JSON.stringify(`Found at: ${result}`)
    };
  } catch (error: unknown) {
    return createAWSResErr(500, error as string[]);
  }
};

const deletePicture = async (filename: string) => {
  const params = {
    Bucket: process.env.USER_AVATAR_BUCKET_NAME!,
    Key: filename
  };

  try {
    return await s3.deleteObject(params).promise();
  } catch (error: any) {
    return createAWSResErr(500, error);
  }
};

const prepareImage = async (body: string) => {
  const base64 = body.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64, 'base64');
};

const uploadPicture = async (filename: string, body: Buffer) => {
  const result = await s3
    .upload({
      Bucket: process.env.REVIEW_BUCKET_NAME!,
      Key: filename,
      Body: body,
      ContentEncoding: 'base64',
      ContentType: 'image/jpg'
    })
    .promise();

  return result.Location;
};

export const handler = middy(setUserAvatar).use(cors());
