import middy from '@middy/core';
import cors from '@middy/http-cors';
import { S3 } from 'aws-sdk';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import IHTTP from '../shared/interfaces/IHTTP';
const s3 = new S3();

export const setReviewPicture = async (event: {
  pathParameters: { slug: string };
  body: string;
}): Promise<IHTTP> => {
  const filename = `${event.pathParameters.slug}.jpg`;
  try {
    await deletePicture(filename);
    const buffer = await prepareImage(event.body);
    const result = await uploadPicture(filename, buffer);
    return {
      statusCode: 200,
      body: JSON.stringify(`Found at: ${result}`)
    };
  } catch (error: any) {
    return createAWSResErr(500, error);
  }
};

const deletePicture = async (filename: string) => {
  const params = {
    Bucket: process.env.REVIEW_BUCKET_NAME!,
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

export const handler = middy(setReviewPicture).use(cors());
