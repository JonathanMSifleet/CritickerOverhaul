const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');

import { Review } from './../models/reviewModel';

dotenv.config({ path: './../config.env' });

// connection
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// connect to MongoDB database:
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

// read JSON file:
const reviews = JSON.parse(fs.readFileSync('./activeReviews.json', 'utf-8'));

// import data into db:
const importData = async () => {
  try {
    await Review.create(reviews, { validateBeforeSave: false });
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

importData();
