import { catchAsyncErrors } from './../utils/catchAsyncErrors';
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');

exports.signup = catchAsyncErrors(async (req: any, res: any, next: any) => {
  // destructuring:
  const { username, firstName, email, password } = req.body;

  let tempUser = new User();
  tempUser.username = username;
  tempUser.firstName = firstName;
  tempUser.email = email;
  tempUser.password = password;

  const newUser = await User.create(tempUser);
  //createSendToken(newUser, 201, res);

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

  res.status(201).json({
    status: 'success'
  });

  //createSendToken(user, 201, res);
});
