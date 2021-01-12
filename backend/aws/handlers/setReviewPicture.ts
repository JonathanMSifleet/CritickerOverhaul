import AWS from 'aws-sdk';
const s3 = new AWS.S3();
const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
import { createAWSResErr } from '../util/createAWSResErr';

export async function setReviewPicture(event: {
  pathParameters: any;
  body: string;
}) {
  try {
    const updatedReviewLocation = await updateReviewPicture(event);
    return {
      statusCode: 200,
      body: JSON.stringify(`Success! Found at: Bucket/${updatedReviewLocation}.jpg`)
    };
  } catch (error) {
    return createAWSResErr(500, error);
  }

  // // Validate review author
  // if (review.email !== email) {
  //   throw new createError.Forbidden(`You are not the author of this review!`);
  // }
}

async function updateReviewPicture(event: { pathParameters: any; body: any }) {
  const { slug } = event.pathParameters;
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  return await uploadPictureToS3(slug + '.jpg', buffer);
}

async function uploadPictureToS3(key: string, body: Buffer): Promise<string> {
  const result = await s3
    .upload({
      Bucket: process.env.REVIEW_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentEncoding: 'base64',
      ContentType: 'image/jpg'
    })
    .promise();

  return result.Location;
}

export const handler = middy(setReviewPicture).use(httpErrorHandler());
