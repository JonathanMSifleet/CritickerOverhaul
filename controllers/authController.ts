const { promisify } = require('util');
import { catchAsyncErrors } from './../utils/catchAsyncErrors';
const createResErr = require('./../utils/createResErr');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

exports.signup = catchAsyncErrors(async (req: any, res: any, next: any) => {
  const newUser = new User ({
    username: req.body.username,
    firstName: req.body.firstName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  newUser.save((err) => {
    if (err) {

      // send error response:
      createResErr(res, 500, err.message);

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

exports.login = catchAsyncErrors(async (req: any, res: any) => {
  const { email, password } = req.body; // use destructuring to get values from req.body

  if (!email || !password) {
    createResErr(res, 400, 'Please provide email and password!');
  }

  const user = await User.findOne({ email }).select('+password +token +tokenExpiry'); // + gets fields that are not select in model

  if (!user || !(await user.correctPassword(password, user.password))) {
    createResErr(res, 401, 'Incorrect email or password');
  }

  createSessionToken(user, res);
});

const createSessionToken = async (user, res) => {
  const token = signToken(user._id);

  // remove unused user properties from output
  user.password = undefined;
  user.role = undefined;
  user.firstName = undefined;
  user.token = undefined;
  user.tokenExpiry = undefined;

  const tokenData = await addJWTToDB(user._id, token);

  res.status(201).json({
    status: 'success',
    user,
    tokenData
  });
};

// add token to database
const addJWTToDB = async (id, token) => {
  const tokenExpiry = Date.now() + (1000 * 60 * 60 * 24);

  // token lasts 24 hours
  const user = await User.findOneAndUpdate(
    { _id: id },
    { $set: { token, tokenExpiry} },
    { new: true }
  );

  return [token, tokenExpiry];

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
    // const { password, passwordConfirm } = req.body; // use destructuring to get values from req.body

    // const user = await User.findById(req.user.id).select('+password'); // + gets fields that are not select in model

    // if (password !== passwordConfirm) {
    //   createResErr(res, 401, 'Passwords do not match');
    // } else if (
    //   (await user.correctPassword(password, user.password)) === false
    // ) {
    //   createResErr(res, 401, 'Incorrect password');
    // }

    console.log('res', res);

    await User.deleteOne({ username: 'JonathanSifleet' }, (err) => {
      if (err) {
        createResErr(res, 404, err);
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
      createResErr(res, 401, 'Unauthorised action, please use a valid authentication token.')
    );
  }

  let isValid = true;
  let decoded = null;
  try{
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch(e) {}

  if(decoded) {
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      isValid = false;
    }

  } else {
    isValid = false;
  }

  if(isValid) {
    next();
  } else {
    createResErr(res, 401, 'The active login token is invalid.');
  }
});
