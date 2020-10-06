const fs = require('fs');
import express from 'express';
const morgan = require('morgan');

const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

app.use(morgan('dev')); // use middleware
app.use(express.json()); // use middleware

app.use('/user', userRouter);
app.use('/review', reviewRouter);

module.exports = app; // export app
