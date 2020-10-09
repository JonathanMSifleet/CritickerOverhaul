import { catchAsyncErrors } from '../utils/catchAsyncErrors';
const AppError = require('./../utils/appError');

const Review = require('./../models/reviewModel');

exports.createReview = catchAsyncErrors(
  async (req: any, res: any, next: any) => {
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
      data: {
        review: newReview
      }
    });
  }
);

exports.getReview = catchAsyncErrors(async (req: any, res: any, next: any) => {
  // get review from slug
  const review = await Review.findOne({ slug: req.params.slug });

  console.log(review);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: review
    }
  });
});

exports.getAllReviews = catchAsyncErrors(
  async (req: any, res: any, next: any) => {
    const reviews = await Review.find({}).select({
      gameName: 1,
      tagline: 1,
      slug: 1,
      image: 1
    });

    res.status(201).json({
      status: 'success',
      data: {
        data: reviews
      }
    });
  }
);
