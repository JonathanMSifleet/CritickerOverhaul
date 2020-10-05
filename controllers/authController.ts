const { promisify } = require('util');
import { catchAsyncErrors } from './../utils/catchAsyncErrors';
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const createSessionToken = (user, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
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
  if (process.env.NODE_ENV === 'development') {
    const user = await User.findOneAndUpdate(
      { _id: id },
      { $set: { token: token } },
      { new: true }
    );
  }
};

exports.signup = catchAsyncErrors(async (req: any, res: any, next: any) => {
  // destructuring:
  const { username, firstName, email, password } = req.body;

  let tempUser = new User();
  tempUser.username = username;
  tempUser.firstName = firstName;
  tempUser.email = email;
  tempUser.password = password;

  const newUser = await User.create(tempUser);
  createSessionToken(newUser, res);

  // sign userID with secret value from
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsyncErrors(async (req: any, res: any, next: any) => {
  const { email, password } = req.body; // use destructuring to get values from req.body

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password'); //+ gets fields that are not select in model

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSessionToken(user._id, res);
});

exports.deleteAccount = catchAsyncErrors(
  async (req: any, res: any, next: any) => {
    let validInput = true;

    const { password, passwordConfirm } = req.body; // use destructuring to get values from req.body

    console.log('User.id', req.user.id);

    const user = await User.findById(req.user.id).select('+password'); //+ gets fields that are not select in model

    if (password !== passwordConfirm) {
      return next(new AppError('Passwords do not match', 401));
    } else if ((await user.correctPassword(password, user.password)) == false) {
      return next(new AppError('Incorrect email or password', 401));
    }

    await User.deleteOne({ _id: req.user.id }, function (err) {
      if (err) return new AppError(err);
    });

    res.status(204).json({
      status: 'success',
      data: null
    });
  }
);

exports.protect = catchAsyncErrors(async (req, res, next) => {
  //check if token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  // validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    );
  }

  req.user = currentUser;
  next();
});
