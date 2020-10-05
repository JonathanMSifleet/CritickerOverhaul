import { catchAsyncErrors } from './../utils/catchAsyncErrors';
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');

exports.signup = catchAsyncErrors(async (req: any, res: any, next: any) => {
  let tempUser = new User();
  tempUser.username = req.body.username;
  tempUser.firstName = req.body.firstName;
  tempUser.email = req.body.email;
  tempUser.password = req.body.password;

  const newUser = await User.create(tempUser);
  //createSendToken(newUser, 201, res);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});
