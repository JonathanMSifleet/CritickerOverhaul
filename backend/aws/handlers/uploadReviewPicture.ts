const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
import { uploadPictureToS3 } from '../lib/review/uploadPictureToS3';
import { setReviewPictureUrl } from '../lib/review/setReviewPictureURL';
import { createAWSResErr } from '../util/createAWSResErr';

export async function uploadReviewPicture(event: {
  pathParameters: any;
  body: string;
}) {
  try {
    const updatedReview = await updateReviewPicture(event);

    return {
      statusCode: 200,
      body: JSON.stringify(updatedReview)
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

  const pictureUrl = await uploadPictureToS3(slug + '.jpg', buffer);
  return await setReviewPictureUrl(slug, pictureUrl);
}

export const handler = middy(uploadReviewPicture).use(httpErrorHandler());
