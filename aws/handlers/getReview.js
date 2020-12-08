const middy = require('middy');
const { cors } = require('middy/middlewares');
import { getReviewBySlug } from '../lib/review/getReviewBySlug';

export async function getReview(event, context) {

  const { slug } = event.pathParameters;
  const review = await getReviewBySlug(slug);

  return {
    statusCode: 200,
    body: JSON.stringify(review)
  };
}

export const handler = middy(getReview)
  .use(cors());