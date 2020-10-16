const { promisify } = require('util');
import { catchAsyncErrors } from './../utils/catchAsyncErrors';
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

exports.signup = catchAsyncErrors(async (req: any, res: any, next: any) => {
  if (req.body.password !== req.body.passwordConfirm) {
    AppError(res, 401, 'Passwords do not match');
  }

  const newUser = new User ({
    username: req.body.username,
    firstName: req.body.firstName,
    email: req.body.email,
    password: req.body.password
  });

  newUser.save((err) => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // User already exists
        res.status(422).json({
          status: 'success',
          message: 'Email already in use'
        });
      }
    } else {
      // sign userID with secret value from
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      });

      res.status(201).json({
        status: 'success',
        token,
        user: newUser
      });
    }
  });
});

exports.login = catchAsyncErrors(async (req: any, res: any, next: any) => {
  const { email, password } = req.body; // use destructuring to get values from req.body

  if (!email || !password) {
    AppError(res, 400, 'Please provide email and password!');
  }

  const user = await User.findOne({ email }).select('+password'); // + gets fields that are not select in model

  if (!user || !(await user.correctPassword(password, user.password))) {
    AppError(res, 401, 'Incorrect email or password');
  }

  createSessionToken(user, res);
});

const createSessionToken = (user, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true
  };

  res.cookie('jwt', token, cookieOptions);

  // remove unused user properties from output
  user.password = undefined;
  user.role = undefined;
  user.token = undefined;

  addJWTToDB(user._id, token);

  res.status(201).json({
    status: 'success',
    token,
    user
  });
};

// add token to database if in development mode:
const addJWTToDB = async (id, token) => {
  token = await bcrypt.hash(token, 12);

  const user = await User.findOneAndUpdate(
    { _id: id },
    { $set: { token } },
    { new: true }
  );
};


exports.signOut = catchAsyncErrors(async (req: any, res: any, usernameToFind: string) => {
  const user = await User.findOneAndUpdate({ username: usernameToFind}, { token: '' });
  req.user = null;

  res.status(200).json({
    status: 'success',
      data: user
  });
});

exports.deleteAccount = catchAsyncErrors(
  async (req: any, res: any, next: any) => {
    const { password, passwordConfirm } = req.body; // use destructuring to get values from req.body

    const user = await User.findById(req.user.id).select('+password'); // + gets fields that are not select in model

    if (password !== passwordConfirm) {
      AppError(res, 401, 'Passwords do not match');
    } else if (
      (await user.correctPassword(password, user.password)) === false
    ) {
      AppError(res, 401, 'Incorrect email or password');
    }

    await User.deleteOne({ _id: req.user.id }, (err) => {
      if (err) {
        AppError(res, 404, err);
      }
    });

    res.status(204).json({
      status: 'success'
    });
  }
);
exports.protect = catchAsyncErrors(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      AppError(res, 401, 'You are not logged in! Please log in to get access.')
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    AppError(res, 401, 'The active login token is invalid.');
  }

  req.user = currentUser;
  next();
});
