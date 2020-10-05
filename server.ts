import mongoose = require('mongoose');
import dotenv = require('dotenv');
import express = require('express');

// catch exceptions:
process.on('uncaughtException', (err) => {
  console.log('Unhandled exception. Shutting down');
  //console.log(err.name, err.message);
  console.log(err.stack);
  process.exit(1);
});

// environment variables:
dotenv.config({ path: './config.env' });

const app = require('./app');

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
  .then(() => console.log('DB Connection successful!'));

// create server:
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log('App running on port', port);
});
