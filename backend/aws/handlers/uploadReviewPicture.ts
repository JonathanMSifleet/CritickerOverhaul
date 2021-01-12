const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const validator = require('@middy/validator');
const createError = require('http-errors');
import { uploadPictureToS3 } from '../lib/review/uploadPictureToS3';
import { setReviewPictureUrl } from '../lib/review/setReviewPictureURL';
import { getReviewBySlug } from '../lib/review/getReviewBySlug';
import uploadReviewPictureSchema from '../lib/schemas/uploadReviewPictureSchema';

export async function uploadReviewPicture(event: {
  pathParameters: any;
  body: string;
}) {
  try {
    const updatedReview = updateReviewPicture(event);

    return {
      statusCode: 200,
      body: JSON.stringify(updatedReview)
    };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

async function getReviewBySlugLocal(slug: { slug: string }) {
  const decodedSlug = slug.slug;
  const review = await getReviewBySlug(decodedSlug);

  return review;
}

async function updateReviewPicture(event) {
  const slug = event.pathParameters;

  const review = await getReviewBySlugLocal(slug);
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  const pictureUrl = await uploadPictureToS3(review.slug + '.jpg', buffer);
  return await setReviewPictureUrl(review.slug, pictureUrl);
}

export const handler = middy(uploadReviewPicture)
  .use(httpErrorHandler())
  .use(validator({ inputSchema: uploadReviewPictureSchema }));
