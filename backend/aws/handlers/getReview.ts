import IHTTP from '../shared/interfaces/IHTTP';
import IHTTPErr from '../shared/interfaces/IHTTPErr';
import cors from '@middy/http-cors';
import middy from '@middy/core';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import { getReviewBySlug } from '../shared/functions/getReviewBySlug';

export const getReview = async (event: {
  pathParameters: { slug: string };
}): Promise<IHTTP | IHTTPErr> => {
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
  } catch (error: any) {
    return createAWSResErr(404, error);
  }
};

export const handler = middy(getReview).use(cors());
