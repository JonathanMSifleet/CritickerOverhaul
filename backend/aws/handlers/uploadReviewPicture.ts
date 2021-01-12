const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const createError = require('http-errors');
import { uploadPictureToS3 } from '../lib/review/uploadPictureToS3';
import { setReviewPictureUrl } from '../lib/review/setReviewPictureURL';

export async function uploadReviewPicture(event: {
  pathParameters: any;
  body: string;
}) {
  try {
    const { slug } = event.pathParameters;
    const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    const pictureUrl = await uploadPictureToS3(slug + '.jpg', buffer);
    const updatedReview = await setReviewPictureUrl(slug, pictureUrl);

    return {
      statusCode: 200,
      body: JSON.stringify(updatedReview)
    };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  // // Validate review author
  // if (review.email !== email) {
  //   throw new createError.Forbidden(`You are not the author of this review!`);
  // }
}

export const handler = middy(uploadReviewPicture).use(httpErrorHandler());
