import express from 'express';
import morgan from 'morgan';

const reviewRouter = require('./routes/reviewRoutes');

const app = express();

app.use(morgan('dev')); // use middleware
app.use(express.json()); // use middleware

app.use('/review', reviewRouter);

module.exports = app; // export app
