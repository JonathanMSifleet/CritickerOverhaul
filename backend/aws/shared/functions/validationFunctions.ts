import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

import EmailValidator from 'email-validator';
import createDynamoSearchQuery from './createDynamoSearchQuery';

export const validateUserInputs = async (
  username: string,
  email: string,
  password: string
): Promise<(string | null)[]> => {
  const errors = await Promise.all([
    checkUniqueAttribute(process.env.EMAIL_INDEX!, 'email', email),
    checkUniqueAttribute(process.env.USERNAME_INDEX!, 'username', username),
    validateValue(username, 'Username'),
    validateValue(email, 'Email'),
    validateValue(password, 'Password')
  ]);

  return errors.flat().filter((error) => error !== null);
};

export const validateValue = async (value: string, valueName: string): Promise<(string | null)[]> => {
  const errors = [validateNotEmpty(value, valueName)];

  switch (valueName) {
    case 'Username':
      errors.push(
        validateLength(value, valueName, 3, 16),
        validateAgainstRegex(value, valueName, /[^A-Za-z0-9]+/, 'cannot contain special characters')
      );
      break;
    case 'Email':
      errors.push(validateLength(value, valueName, 3, 256), validateIsEmail(value));
      break;
  }
  return await Promise.all(errors);
};

export const validateAgainstRegex = async (
  value: string,
  name: string,
  regex: RegExp,
  message: string
): Promise<string | null> => (regex.test(value) ? `${name} ${message}` : null);

export const validateIsEmail = async (value: string): Promise<string | null> =>
  !EmailValidator.validate(value) ? `Email must be valid` : null;

export const validateNotEmpty = async (value: string, name: string): Promise<string | null> =>
  value === null || value === '' || value === undefined ? `${name} must not be empty` : null;

export const validateLength = async (
  value: string,
  valueName: string,
  min: number,
  max: number
): Promise<string | null> =>
  value.length < min || value.length > max ? `${valueName} must be between ${min} and ${max} characters` : null;

export const checkUniqueAttribute = async (
  indexName: string,
  keyName: string,
  keyValue: string
): Promise<string | null> => {
  const query = createDynamoSearchQuery(process.env.USER_TABLE_NAME!, keyName, keyName, keyValue, 'S', indexName);

  try {
    const dbClient = new DynamoDBClient({});
    const result = await dbClient.send(new QueryCommand(query));

    return result.Items![0] ? `${alphabeticalizeFirstChar(keyName)} already in use` : null;
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return null;
  }
};

const alphabeticalizeFirstChar = (input: string): string => input.charAt(0).toUpperCase() + input.slice(1);
