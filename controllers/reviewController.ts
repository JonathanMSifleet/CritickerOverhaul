import { catchAsyncErrors } from '../utils/catchAsyncErrors';
const createResErr = require('./../utils/createResErr');

const Review = require('./../models/reviewModel');

exports.createReview = catchAsyncErrors(
  async (req: any, res: any) => {
    const jsonReview = {
      gameName: req.body.gameName,
      tagline: req.body.tagline,
      blurb: req.body.blurb,
      review: req.body.review,
      allowComments: req.body.allowComments,
      author: req.body.author
    };

    const newReview = await Review.create(jsonReview);

    res.status(201).json({
      status: 'success',
      review: newReview
    });
  }
);

exports.getReview = catchAsyncErrors(async (req: any, res: any) => {
  // get review from slug
  const review = await Review.findOne({ slug: req.params.slug });

  if (!review) {
    createResErr(res, 404, 'No review found with that ID');
  } else {
    res.status(200).json({
      status: 'success',
      data: review
    });
  }
});

exports.getAllReviews = catchAsyncErrors(
  async (_req: any, res: any) => {
    const reviews = await Review.find({}).select({
      gameName: 1,
      tagline: 1,
      slug: 1,
      image: 1
    });

    res.status(201).json({
      status: 'success',
      data: reviews
    });
  }
);
