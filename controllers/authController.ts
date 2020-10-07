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

const createSessionToken = (user, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true
  };

  res.cookie('jwt', token, cookieOptions);

  // remove password from output
  user.password = undefined;

  addJWTToDB(user._id, token);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user
    }
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

exports.signup = catchAsyncErrors(async (req: any, res: any, next: any) => {
  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppError('Passwords do not match', 401));
  }

  const jsonUser = {
    username: req.body.username,
    firstName: req.body.firstName,
    email: req.body.email,
    password: req.body.password
  };

  const newUser = await User.create(jsonUser);

  // sign userID with secret value from
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  await createSessionToken(newUser, res);
});

exports.login = catchAsyncErrors(async (req: any, res: any, next: any) => {
  const { email, password } = req.body; // use destructuring to get values from req.body

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password'); // + gets fields that are not select in model

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSessionToken(user, res);
});

exports.signOut = catchAsyncErrors(async (req: any, res: any) => {
  const user = await User.findOneAndUpdate({ _id: req.user.id }, { token: '' });
  req.user = null;

  res.status(200).json({
    status: 'success',
    data: {
      data: user
    }
  });
});

exports.deleteAccount = catchAsyncErrors(
  async (req: any, res: any, next: any) => {
    const { password, passwordConfirm } = req.body; // use destructuring to get values from req.body

    console.log('User.id', req.user.id);

    const user = await User.findById(req.user.id).select('+password'); // + gets fields that are not select in model

    if (password !== passwordConfirm) {
      return next(new AppError('Passwords do not match', 401));
    } else if (
      (await user.correctPassword(password, user.password)) === false
    ) {
      return next(new AppError('Incorrect email or password', 401));
    }

    await User.deleteOne({ _id: req.user.id }, function (err) {
      if (err) {
        return new AppError(err);
      }
    });

    res.status(204).json({
      status: 'success',
      data: null
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
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The active login token is invalid.', 401));
  }

  req.user = currentUser;
  next();
});
