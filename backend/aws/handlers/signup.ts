import middy from '@middy/core';
import cors from '@middy/http-cors';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import EmailValidator from 'email-validator';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import IHTTP from '../shared/interfaces/IHTTP';
import IHTTPErr from '../shared/interfaces/IHTTPErr';
import shortUUID from 'short-uuid';

const DB = new DynamoDB.DocumentClient();

const signup = async (event: { body: string }): Promise<IHTTPErr | IHTTP> => {
  const { username, email, password } = JSON.parse(event.body);

  const existingUser = await checkUserExists(email);

  if (!existingUser) {
    let errors = (await validateUserInputs(
      username,
      email,
      password
    )) as string[];
    errors = await removeEmptyErrors(errors);

    if (errors.length === 0) {
      const uid = shortUUID.generate();
      const result = await insertUserToDB(username, email, password, uid);

      console.log('User signed up successfully');
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
};

const removeEmptyErrors = async (errors: string[]) => {
  let arrayLength = errors.length;
  while (arrayLength--) {
    if (errors[arrayLength] === undefined) {
      errors.splice(arrayLength, 1);
    }
  }
  return errors;
};

const validateNotEmpty = async (
  value: string,
  name: string
): Promise<string | undefined> => {
  if (value === null || value === '' || value === undefined) {
    return `${name} must not be empty`;
  }
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
  if (regex.test(value)) {
    return `${name} ${message}`;
  }
};

const validateIsEmail = async (value: string) => {
  if (!EmailValidator.validate(value)) {
    return `Email must be valid`;
  }
};

const validateUserInputs = async (
  username: string,
  email: string,
  password: string
) => {
  const errors = [];
  // ... pushes items in array to array rather than array to array:
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
      localErrors.push(await validateLength(value, 'Password Hash', 512, 512));
      break;
    default:
      localErrors.push('Unexpected error');
  }
  return localErrors;
};

const checkUserExists = async (email: string) => {
  const params: DynamoDB.DocumentClient.GetItemInput = {
    TableName: process.env.USER_TABLE_NAME!,
    Key: { email }
  };

  try {
    const result = (await DB.get(params).promise()) as { Item: any };
    return result.Item;
  } catch (error: any) {
    return createAWSResErr(404, error);
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
