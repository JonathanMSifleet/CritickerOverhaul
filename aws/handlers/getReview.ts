const middy = require('middy');
const { cors } = require('middy/middlewares');
import { getReviewBySlug } from '../lib/review/getReviewBySlug';
import { createAWSResErr } from '../util/createAWSResErr';

export async function getReview(event, _context) {

  const { slug } = event.pathParameters;

  try {
    const review = await getReviewBySlug(slug);
    return {
      statusCode: 200,
      body: JSON.stringify(review)
    };
  } catch (e) {
    console.error(e);
    return createAWSResErr(404, e);
  }
}

export const handler = middy(getReview)
  .use(cors());