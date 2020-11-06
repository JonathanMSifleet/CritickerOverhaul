import { createAWSResErr } from '../../utils/createAWSResErr';
const middy = require('middy');
const { cors } = require('middy/middlewares');
import AWS from 'aws-sdk';
import * as EmailValidator from 'email-validator';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function signup(event, context) {

  // const { username, firstName, email, password } = JSON.parse(event.body);


  const username = 'Jonathan1!';
  const firstName = '!1';
  const email = '!1';
  const password = 'neenaw';

  const errors = await validateUserInputs(username, firstName, email, password);
  if(errors.length !== 0) {
    let result;
    try {
      result = await insertUserToDB(username, firstName, email, password);

      return {
        statusCode: 201,
        body: JSON.stringify(result)
      };
    } catch (e) {
      console.error(e);
      createAWSResErr(404, e);
    }
  } else {
    errors.forEach(element => {
      console.error(element);
    });
  }
}

async function insertUserToDB(username, firstName, email, password) {

  const params = {
    Item: {
      "username": username,
      "firstName": firstName,
      "email": email,
      "password": password
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: process.env.USER_TABLE_NAME
  };

  const result = await dynamodb.put(params).promise();
  return result.Attributes;

}

async function validateUserInputs(username, firstName, email, password) {
  let errors = [];
  errors.push(await validateInput(username, 'Username'));
  errors.push(await validateInput(firstName, 'First name'));
  errors.push(await validateInput(email, 'Email'));
  errors.push(await validateInput(password, 'Password'));
  return errors;
}


async function validateInput(value, name) {
  let errors = [];
  switch (name) {
    case 'Username':
      errors.push(this.validateNotEmpty(value, name));
      errors.push(this.validateLength(value, name, 3, 16));
      errors.push(this.validateAgainstRegex(value, name, /[^A-Za-z0-9]+/, 'cannot contain special characters'));
      break;
    case 'First name':
      errors.push(validateNotEmpty(value, name));
      errors.push(validateLength(value, name, 3, 20));
      errors.push(validateAgainstRegex(value, name, /[^A-Za-z]+/, 'can only contain letters'));
      break;
    case 'Email':
      errors.push(validateNotEmpty(value, name));
      errors.push(validateLength(value, name, 3, 256));
      errors.push(validateIsEmail(value));
      break;
    case 'Password':
      errors.push(validateNotEmpty(value, name));
      errors.push(validateLength(value, name, 55, 128));
      break;
    default:
      errors.push('Unexpected error');
  }

  let arrayLength = this.errors.length;
  while (arrayLength--) {
    if (errors[arrayLength] === undefined) {
      errors.splice(arrayLength, 1);
    }
  }
  return errors;
}

async function validateNotEmpty(value, name) {
  if (value === null || value === '' || value === undefined) {
    return `${name} must not be empty`;
  }
}

async function validateLength(value, name, min, max) {
  if (value.length < min || value.length > max) {
    return `${name} must be between ${min} and ${max} chracters`;
  }
}

async function validateAgainstRegex(value, name, regex, message) {
  if (regex.test(value)) {
    return `${name} ${message}`;
  }
}

async function validateIsEmail(value) {
  if (!EmailValidator.validate(value)) {
    return `Email must be valid`;
  }
}

export const handler = middy(signup)
  .use(cors());
