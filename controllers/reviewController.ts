import Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');

exports.createReview = factory.createOne(Review);
