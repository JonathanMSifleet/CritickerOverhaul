import express from 'express';
const reviewController = require('./../controllers/reviewController');

const router = express.Router();

// routes:

router.post('/createReview', reviewController.createReview);

module.exports = router;
