import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import validator from '@middy/validator';
import createError from 'http-errors';
import { getReview } from './getReview';
import { uploadPictureToS3 } from '../lib/uploadPictureToS3';
import { setReviewPictureUrl } from '../lib/setReviewPictureUrl';
import uploadReviewPictureSchmea from '../lib/schemas/uploadReviewPictureSchema';

export async function uploadReviewPicture(event) {
  const { id } = event.pathParameters;
  // const { email } = event.requestContext.authorizer;
  const review = await getReview(id);

  // // Validate review ownership
  // if (auction.seller !== email) {
  //   throw new createError.Forbidden(`You are not the seller of this auction!`);
  // }

  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  let updatedReview;

  try {
    const pictureUrl = await uploadPictureToS3(review.id + '.jpg', buffer);
    updatedReview = await setReviewPictureUrl(review.id, pictureUrl);
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedReview),
  };
}

export const handler = middy(uploadReviewPicture)
  .use(httpErrorHandler())
  .use(validator({ inputSchema: uploadReviewPictureSchmea }));