import middy from '@middy/core';
import cors from '@middy/http-cors';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import EmailValidator from 'email-validator';
import shortUUID from 'short-uuid';
import IHTTP from '../shared/interfaces/IHTTP';
import IHTTPErr from '../shared/interfaces/IHTTPErr';
import { createAWSResErr } from './../shared/functions/createAWSResErr';

const DB = new DynamoDB.DocumentClient();

const signup = async (event: { body: string }): Promise<IHTTPErr | IHTTP> => {
  const { username, email, password } = JSON.parse(event.body);

  if (await checkUniqueEmail(email))
    return createAWSResErr(403, 'Email already in use');

  if (await checkUniqueUsername(username))
    return createAWSResErr(403, 'Username already in use');

  let errors = (await validateUserInputs(
    username,
    email,
    password
  )) as string[];

  errors = await removeEmptyErrors(errors);
  if (errors.length !== 0) return createAWSResErr(400, errors);

  try {
    const uid = shortUUID.generate();
    const result = await insertUserToDB(username, email, password, uid);

    return {
      statusCode: 201,
      body: JSON.stringify(result)
    };
  } catch (e) {
    console.error(e);
    return createAWSResErr(520, errors);
  }
};

const removeEmptyErrors = async (errors: string[]) => {
  let arrayLength = errors.length;
  while (arrayLength--) {
    if (errors[arrayLength] === undefined) errors.splice(arrayLength, 1);
  }
  return errors;
};

const validateNotEmpty = async (
  value: string,
  name: string
): Promise<string | undefined> => {
  if (value === null || value === '' || value === undefined)
    return `${name} must not be empty`;
};

const validateLength = async (
  value: string,
  valueName: string,
  min: number,
  max: number
) => {
  if (value.length < min || value.length > max) {
    return `${valueName} must be between ${min} and ${max} chracters`;
  }
};

const validateAgainstRegex = async (
  value: string,
  name: string,
  regex: RegExp,
  message: string
) => {
  if (regex.test(value)) return `${name} ${message}`;
};

const validateIsEmail = async (value: string) => {
  if (!EmailValidator.validate(value)) return `Email must be valid`;
};

const validateUserInputs = async (
  username: string,
  email: string,
  password: string
) => {
  const errors = [];

  errors.push(...(await validateInput(username, 'Username')));
  errors.push(...(await validateInput(email, 'Email')));
  errors.push(...(await validateInput(password, 'Password')));

  return errors;
};

const validateInput = async (value: string, valueName: string) => {
  const localErrors = [];

  switch (valueName) {
    case 'Username':
      localErrors.push(await validateNotEmpty(value, valueName));
      localErrors.push(await validateLength(value, valueName, 3, 16));
      localErrors.push(
        await validateAgainstRegex(
          value,
          valueName,
          /[^A-Za-z0-9]+/,
          'cannot contain special characters'
        )
      );
      break;
    case 'name':
      localErrors.push(await validateNotEmpty(value, valueName));
      localErrors.push(await validateLength(value, valueName, 3, 20));
      localErrors.push(
        await validateAgainstRegex(
          value,
          valueName,
          /[^A-Za-z]+/,
          'can only contain letters'
        )
      );
      break;
    case 'Email':
      localErrors.push(await validateNotEmpty(value, valueName));
      localErrors.push(await validateLength(value, valueName, 3, 256));
      localErrors.push(await validateIsEmail(value));
      break;
    case 'Password':
      localErrors.push(await validateNotEmpty(value, valueName));
      localErrors.push(await validateLength(value, 'Password Hash', 128, 128));
      break;
    default:
      localErrors.push('Unexpected error');
  }
  return localErrors;
};

const checkUniqueEmail = async (email: string) => {
  const params = {
    TableName: process.env.USER_TABLE_NAME!,
    IndexName: 'email',
    KeyConditionExpression: '#email = :email',
    ExpressionAttributeNames: {
      '#email': 'email'
    },
    ExpressionAttributeValues: {
      ':email': email
    }
  };

  try {
    const result = await DB.query(params).promise();
    const resultItems = result.Items;

    if (resultItems!.length !== 0) {
      console.log(resultItems);
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
  }
};

const checkUniqueUsername = async (username: string) => {
  const params = {
    TableName: process.env.USER_TABLE_NAME!,
    IndexName: 'username',
    KeyConditionExpression: '#username = :username',
    ExpressionAttributeNames: {
      '#username': 'username'
    },
    ExpressionAttributeValues: {
      ':username': username
    }
  };

  try {
    const result = await DB.query(params).promise();
    const resultItems = result.Items;

    if (resultItems!.length !== 0) {
      console.log(resultItems);
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
  }
};

const insertUserToDB = async (
  username: string,
  email: string,
  password: string,
  uid: string
) => {
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.USER_TABLE_NAME!,
    Item: {
      username,
      email,
      password,
      uid
    },
    ReturnConsumedCapacity: 'TOTAL'
  };

  return await DB.put(params).promise();
};

export const handler = middy(signup).use(cors());
