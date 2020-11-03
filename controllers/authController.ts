const { promisify } = require('util');
import { catchAsyncErrors } from './../utils/catchAsyncErrors';
const createResErr = require('./../utils/createResErr');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');

// const signToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '30d'
//   });
// };

// // add token to database
// const addJWTToDB = async (id, token) => {
//   const tokenExpiry = Date.now() + (1000 * 60 * 60 * 24);

//   // token lasts 24 hours
//   await User.findOneAndUpdate(
//     { _id: id },
//     { $set: { token, tokenExpiry} },
//     { new: true }
//   );

//   return [token, tokenExpiry];

// };

// const createSessionToken = async (user, res) => {
//   const token = signToken(user._id);

//   // remove unused user properties from output
//   user.password = undefined;
//   user.role = undefined;
//   user.firstName = undefined;
//   user.token = undefined;
//   user.tokenExpiry = undefined;

//   const tokenData = await addJWTToDB(user._id, token);

//   res.status(201).json({
//     status: 'success',
//     user,
//     tokenData
//   });
// };

exports.signOut = catchAsyncErrors(async (req: any, res: any, usernameToFind: string) => {
  const user = await User.findOneAndUpdate({ username: usernameToFind}, { token: '' });
  req.user = null;

  res.status(200).json({
    status: 'success',
      data: user
  });
});

exports.protect = catchAsyncErrors(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  let isValid = true;

  if (!token) {
    isValid = false;
  } else {
    try{
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id);
      if (currentUser) {
        next();
      } else {
        isValid = false;
      }
    } catch (e) {
      isValid = false;
    }
  }

  if (!isValid) {
    createResErr(res, 401, 'The active login token is invalid.');
  }

});
