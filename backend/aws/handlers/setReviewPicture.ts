import AWS from 'aws-sdk';
const s3 = new AWS.S3();
const middy = require('@middy/core');
const cors = require('@middy/http-cors');
import { createAWSResErr } from '../sharedFunctions/createAWSResErr';

export async function setReviewPicture(event: {
  pathParameters: any;
  body: string;
}) {
  const { slug } = event.pathParameters;
  try {
    await deletePicture(slug);
    const buffer = await prepareImage(event.body);
    const result = await uploadPicture(slug, buffer);
    return {
      statusCode: 200,
      body: JSON.stringify(`Found at: ${result}`)
    };
  } catch (error) {
    return createAWSResErr(500, error);
  }
}
async function deletePicture(slug: string) {
  console.log(
    '🚀 ~ file: setReviewPicture.ts ~ line 26 ~ deletePicture ~ slug',
    slug
  );
  const params = {
    Bucket: process.env.REVIEW_BUCKET_NAME,
    Key: slug
  };

  try {
    return await s3.deleteObject(params).promise();
  } catch (error) {
    return createAWSResErr(500, error);
  }
}

async function prepareImage(body: string) {
  const base64 = body.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64, 'base64');
}

async function uploadPicture(slug: string, body: Buffer) {
  const result = await s3
    .upload({
      Bucket: process.env.REVIEW_BUCKET_NAME,
      Key: slug,
      Body: body,
      ContentEncoding: 'base64',
      ContentType: 'image/jpg'
    })
    .promise();

  return result.Location;
}

export const handler = middy(setReviewPicture).use(cors());
