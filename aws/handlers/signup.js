import { createAWSResErr } from '../../utils/createAWSResErr';
const middy = require('middy');
const { cors } = require('middy/middlewares');
import AWS from 'aws-sdk';
import * as EmailValidator from 'email-validator';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function signup(event, context) {

  const { username, firstName, email, password } = JSON.parse(event.body);

  let errors = await validateUserInputs(username, firstName, email, password);
  errors = await removeEmptyErrors(errors);

  if(errors.length === 0) {
    const result = await insertUserToDB(username, firstName, email, password);

    if(result !== null) {
      return {
        statusCode: 201,
        body: JSON.stringify(result)
      };
    } else {
      return createAWSResErr(403, "Unknown error");
    }
  } else {
    logErrors(errors);
    return createAWSResErr(400, errors);
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

  return await dynamodb.put(params).promise();
}

async function validateUserInputs(username, firstName, email, password) {
  let errors = [];
  errors.push(... await validateInput(username, 'Username'));
  errors.push(... await validateInput(firstName, 'First name'));
  errors.push(... await validateInput(email, 'Email'));
  errors.push(... await validateInput(password, 'Password'));

  return errors;
}

async function validateInput(value, name) {

  let localErrors = [];

  switch (name) {
    case 'Username':
      localErrors.push(await validateNotEmpty(value, name));
      localErrors.push(await validateLength(value, name, 3, 16));
      localErrors.push(await validateAgainstRegex(value, name, /[^A-Za-z0-9]+/, 'cannot contain special characters'));
      break;
    case 'First name':
      localErrors.push(await validateNotEmpty(value, name));
      localErrors.push(await validateLength(value, name, 3, 20));
      localErrors.push(await validateAgainstRegex(value, name, /[^A-Za-z]+/, 'can only contain letters'));
      break;
    case 'Email':
      localErrors.push(await validateNotEmpty(value, name));
      localErrors.push(await validateLength(value, name, 3, 256));
      localErrors.push(await validateIsEmail(value));
      break;
    case 'Password':
      localErrors.push(await validateNotEmpty(value, name));
      localErrors.push(await validateLength(value, name, 55, 128));
      break;
    default:
      localErrors.push('Unexpected error');
  }
  return localErrors;
}

async function removeEmptyErrors(errors) {
  let arrayLength = errors.length;
  while (arrayLength--) {
    if (errors[arrayLength] === undefined) {
      errors.splice(arrayLength, 1);
    }
  }
  return errors;
}

async function logErrors(errors) {
  let i = 0;
  errors.forEach(element => {
    i++;
    console.error(`${i}) ${element}`);
  });
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
