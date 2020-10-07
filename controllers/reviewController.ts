import { catchAsyncErrors } from '../utils/catchAsyncErrors';
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

exports.getAllReviews = catchAsyncErrors(
  async (req: any, res: any, next: any) => {
    const reviews = await Review.find({})
      .select({ gameName: 1, tagLine: 1, slug: 1, image: 1, createdAt: 1 })
      .sort({ createdAt: -1 }); // sort broken

    console.log(reviews);

    res.status(201).json({
      status: 'success',
      data: {
        data: reviews
      }
    });
  }
);
