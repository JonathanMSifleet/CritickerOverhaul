const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  gameName: {
    type: String,
    required: [true, 'A review must be about a gane'],
    minlength: [1, 'Shortest video game name ever is "D"'],
    maxlength: [512, 'Longest video game in the world has over 300 characters'],
    trim: true,
    unique: true
  },
  tagline: {
    type: String,
    trim: true
  },
  blurb: {
    type: String,
    trim: true
  },
  review: {
    type: String,
    required: true,
    minlength: [1, 'Review must be longer than 1 character'],
    trim: true
  },
  allowsComments: {
    type: Boolean,
    required: true
  },
  author: {
    type: String,
    minlength: 5,
    maxlength: 37,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now.toISOString()
  }
});

// generate slug, use slug to get image path
