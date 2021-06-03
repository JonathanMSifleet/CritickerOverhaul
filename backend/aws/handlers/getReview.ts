import middy from '@middy/core';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import { getReviewBySlug } from '../shared/functions/getReviewBySlug';
import IHTTP from '../shared/interfaces/IHTTP';

export const getReview = async (event: {
  pathParameters: { slug: string };
}): Promise<IHTTP> => {
  const { slug } = event.pathParameters;

  try {
    const review = await getReviewBySlug(slug);
    if (review === undefined) {
      return createAWSResErr(404, 'Invalid Slug');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(review)
    };
  } catch (errorMessage) {
    return createAWSResErr(404, errorMessage);
  }
};

export const handler = middy(getReview).use(cors());
