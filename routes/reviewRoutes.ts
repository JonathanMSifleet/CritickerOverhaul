import express from 'express';
import cors from 'cors';
const reviewController = require('./../controllers/reviewController');

const router = express.Router();

// routes:
router.options('/:slug', cors());
router.get('/:slug', cors(), reviewController.getReview);

router.options('/createReview', cors());
router.post(
  '/createReview',
  cors(),
  reviewController.createReview
);

module.exports = router;
