const middy = require('middy');
const cors = require('@middy/http-cors');
import { getReviewBySlug } from '../lib/review/getReviewBySlug';
import { createAWSResErr } from '../util/createAWSResErr';

export async function getReview(
  event: { pathParameters: { slug: string } },
  _context: any
) {
  const { slug } = event.pathParameters;

  try {
    const review = await getReviewBySlug(slug);
    if (review === undefined) {
      throw 'Invalid slug';
    }

    return {
      statusCode: 200,
      body: JSON.stringify(review)
    };
  } catch (errorMessage) {
    return createAWSResErr(404, errorMessage);
  }
}

export const handler = middy(getReview).use(cors());
