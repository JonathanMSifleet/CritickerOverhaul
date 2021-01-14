import AWS from 'aws-sdk';
const s3 = new AWS.S3();
const middy = require('@middy/core');
const cors = require('@middy/http-cors');
import { createAWSResErr } from '../sharedFunctions/createAWSResErr';

export async function setReviewPicture(event: {
  pathParameters: { slug: string };
  body: string;
}) {
  console.log(
    '🚀 ~ file: setReviewPicture.ts ~ line 11 ~ slug',
    event.pathParameters.slug
  );
  const filename = `${event.pathParameters.slug}.jpg`;
  try {
    await deletePicture(filename);
    const buffer = await prepareImage(event.body);
    const result = await uploadPicture(filename, buffer);
    return {
      statusCode: 200,
      body: JSON.stringify(`Found at: ${result}`)
    };
  } catch (error) {
    return createAWSResErr(500, error);
  }
}
async function deletePicture(filename: string) {
  const params = {
    Bucket: process.env.REVIEW_BUCKET_NAME,
    Key: filename
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

async function uploadPicture(filename: string, body: Buffer) {
  const result = await s3
    .upload({
      Bucket: process.env.REVIEW_BUCKET_NAME,
      Key: filename,
      Body: body,
      ContentEncoding: 'base64',
      ContentType: 'image/jpg'
    })
    .promise();

  return result.Location;
}

export const handler = middy(setReviewPicture).use(cors());
