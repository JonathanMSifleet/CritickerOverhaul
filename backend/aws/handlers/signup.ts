import { createAWSResErr } from '../sharedFunctions/createAWSResErr';
const middy = require('middy');
const cors = require('@middy/http-cors');
const AWS = require('aws-sdk');
const EmailValidator = require('email-validator');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function signup(event: { body: string }, _context: any) {
  const { username, firstName, email, password } = JSON.parse(event.body);

  const existingUser = await checkUserExists(email);

  if (existingUser === undefined) {
    let errors = await validateUserInputs(username, firstName, email, password);
    errors = await removeEmptyErrors(errors);

    if (errors.length === 0) {
      const result = await insertUserToDB(username, firstName, email, password);
      return {
        statusCode: 201,
        body: JSON.stringify(result)
      };
    } else {
      return createAWSResErr(400, errors);
    }
  } else {
    return createAWSResErr(403, 'Email already in use');
  }
}

async function removeEmptyErrors(errors: string[]) {
  let arrayLength = errors.length;
  while (arrayLength--) {
    if (errors[arrayLength] === undefined) {
      errors.splice(arrayLength, 1);
    }
  }
  return errors;
}

async function validateNotEmpty(value: string, name: string) {
  if (value === null || value === '' || value === undefined) {
    return `${name} must not be empty`;
  }
}

async function validateLength(
  value: string,
  name: string,
  min: number,
  max: number
) {
  if (value.length < min || value.length > max) {
    return `${name} must be between ${min} and ${max} chracters`;
  }
}

async function validateAgainstRegex(
  value: string,
  name: string,
  regex: RegExp,
  message: string
) {
  if (regex.test(value)) {
    return `${name} ${message}`;
  }
}

async function validateIsEmail(value: string) {
  if (!EmailValidator.validate(value)) {
    return `Email must be valid`;
  }
}

async function validateUserInputs(
  username: string,
  firstName: string,
  email: string,
  password: string
) {
  let errors = [];
  // ... pushes items in array to array rather than array to array:
  errors.push(...(await validateInput(username, 'Username')));
  errors.push(...(await validateInput(firstName, 'First name')));
  errors.push(...(await validateInput(email, 'Email')));
  errors.push(...(await validateInput(password, 'Password')));
  return errors;
}

async function validateInput(value: string, name: string) {
  let localErrors = [];

  switch (name) {
    case 'Username':
      localErrors.push(await validateNotEmpty(value, name));
      localErrors.push(await validateLength(value, name, 3, 16));
      localErrors.push(
        await validateAgainstRegex(
          value,
          name,
          /[^A-Za-z0-9]+/,
          'cannot contain special characters'
        )
      );
      break;
    case 'First name':
      localErrors.push(await validateNotEmpty(value, name));
      localErrors.push(await validateLength(value, name, 3, 20));
      localErrors.push(
        await validateAgainstRegex(
          value,
          name,
          /[^A-Za-z]+/,
          'can only contain letters'
        )
      );
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

async function checkUserExists(email: string) {
  const params = {
    TableName: process.env.USER_TABLE_NAME,
    Key: { email }
  };

  try {
    const result = await dynamodb.get(params).promise();

    return result.Item;
  } catch (e) {
    return createAWSResErr(404, e);
  }
}

async function insertUserToDB(
  username: string,
  firstName: string,
  email: string,
  password: string
) {
  const params = {
    TableName: process.env.USER_TABLE_NAME,
    Item: {
      username,
      firstName,
      email,
      password
    },
    ReturnConsumedCapacity: 'TOTAL'
  };

  return await dynamodb.put(params).promise();
}

export const handler = middy(signup).use(cors());
