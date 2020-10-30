import mongoose = require('mongoose');
import dotenv = require('dotenv');
import cors = require('cors');

// catch exceptions:
process.on('uncaughtException', (err) => {
  console.log('Unhandled exception. Shutting down');
  console.log(err.stack);
  process.exit(1);
});

// environment variables:
dotenv.config({ path: './config.env' });

const app = require('./app');
app.use(cors());

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
app.listen(port, () => {
  console.log('CORS-enabled App running on port', port);
});
