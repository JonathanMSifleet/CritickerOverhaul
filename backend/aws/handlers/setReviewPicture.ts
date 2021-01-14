import AWS from 'aws-sdk';
const s3 = new AWS.S3();
const middy = require('@middy/core');
const cors = require('@middy/http-cors');
import { createAWSResErr } from '../sharedFunctions/createAWSResErr';

export async function setReviewPicture(event: {
  pathParameters: any;
  body: string;
}) {
  try {
    const updatedReviewLocation = await prepareImage(event);
    return {
      statusCode: 200,
      body: JSON.stringify(`Found at: ${updatedReviewLocation}`)
    };
  } catch (error) {
    return createAWSResErr(500, error);
  }

  // // Validate review author
  // if (review.email !== email) {
  //   throw new createError.Forbidden(`You are not the author of this review!`);
  // }
}

async function prepareImage(event: {
  pathParameters: { slug: string };
  body: string;
}) {
  const { slug } = event.pathParameters;
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  return await updatePicture(slug + '.jpg', buffer);
}

async function updatePicture(slug: string, body: Buffer) {
  try {
    await deletePicure(slug);
    const result = await uploadPicture(slug, body);
    return result.Location;
  } catch (error) {
    return createAWSResErr(500, error);
  }
}

async function deletePicure(slug: string) {
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

async function uploadPicture(slug: string, body: Buffer) {
  return await s3
    .upload({
      Bucket: process.env.REVIEW_BUCKET_NAME,
      Key: slug,
      Body: body,
      ContentEncoding: 'base64',
      ContentType: 'image/jpg'
    })
    .promise();
}

export const handler = middy(setReviewPicture).use(cors());
