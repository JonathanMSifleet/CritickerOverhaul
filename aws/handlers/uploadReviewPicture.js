import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import validator from '@middy/validator';
import createError from 'http-errors';
import { uploadPictureToS3 } from '../lib/review/uploadPictureToS3';
import { setReviewPictureUrl } from '../lib/review/setReviewPictureURL';
import { getReviewBySlug } from '../lib/review/getReviewBySlug';
import uploadReviewPictureSchema from '../lib/schemas/uploadReviewPictureSchema';

export async function uploadReviewPicture(event) {
  const slug = event.pathParameters;

  // const { email } = event.requestContext.authorizer;

  const review = await getReviewBySlugLocal(slug);

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

    return {
      statusCode: 200,
      body: JSON.stringify(updatedReview),
    };

  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

async function getReviewBySlugLocal(slug) {

  const decodedSlug = slug.slug;
  const review = await getReviewBySlug(decodedSlug);

  return review;
}

export const handler = middy(uploadReviewPicture)
  .use(httpErrorHandler())
  .use(validator({ inputSchema: uploadReviewPictureSchema }));