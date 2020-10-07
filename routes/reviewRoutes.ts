import express from 'express';
import cors from 'cors';

const reviewController = require('./../controllers/reviewController');

const router = express.Router();

// routes:
router.options('/getAllReviews', cors());
router.get('/getAllReviews', cors(), reviewController.getAllReviews);

router.post('/createReview', reviewController.createReview);

module.exports = router;
