const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');

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
