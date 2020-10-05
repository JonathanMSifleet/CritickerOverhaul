import { catchAsyncErrors } from './../utils/catchAsyncErrors';
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
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
