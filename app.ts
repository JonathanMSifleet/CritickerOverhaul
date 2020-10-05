const fs = require('fs');
import express from 'express';
const morgan = require('morgan');

const userRouter = require('./routes/userRoutes');

const app = express();

app.use(morgan('dev')); // use middleware
app.use(express.json()); // use middleware

app.use('/', userRouter);

module.exports = app; // export app
