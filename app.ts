import express from 'express';
import morgan from 'morgan';

const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

app.use(morgan('dev')); // use middleware
app.use(express.json()); // use middleware

app.use('/user', userRouter);
app.use('/review', reviewRouter);

module.exports = app; // export app
