// import { createAWSResErr } from '../../utils/createAWSResErr';
// const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const middy = require('middy');
const { cors } = require('middy/middlewares');

async function signup(event, context) {

  const { username, firstName, email, password, passwordConfirm } = JSON.parse(event.body);

  const newUser = new User ({
    username,
    firstName,
    email,
    password,
    passwordConfirm
  });

  return {
    statusCode: 201,
    body: JSON.stringify(newUser)
  };

  // newUser.save((err) => {
  //   if (err) {

  //     // send error response:
  //     createAWSResErr(500, err.message);

  //   } else {
  //     // sign userID with secret value from
  //     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //       expiresIn: '30d'
  //     });

  //     return {
  //       statusCode: 201,
  //       headers: {
  //         'Access-Control-Allow-Origin': '*',
  //         'Access-Control-Allow-Credentials': true,
  //       },
  //       token,
  //       user: newUser
  //     };
  //   }
  // });
}

export const handler = middy(signup)
  .use(cors());