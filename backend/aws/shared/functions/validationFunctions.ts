import DynamoDB from 'aws-sdk/clients/dynamodb';
import EmailValidator from 'email-validator';
import formSearchQuery from './formSearchQuery';
const DB = new DynamoDB.DocumentClient();

export const validateUserInputs = async (
  username: string,
  email: string,
  password: string
): Promise<(string | null)[]> => {
  const validationMessages = await Promise.all([
    validateValue(username, 'Username'),
    validateValue(email, 'Email'),
    validateValue(password, 'Password')
  ]);

  const errors = validationMessages.flat();
  return errors.filter((error) => error !== null);
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
      errors.push(validateNotEmpty(value, valueName), validateLength(value, valueName, 3, 256), validateIsEmail(value));
      break;
    case 'Password':
      errors.push(validateNotEmpty(value, valueName), validateLength(value, 'Password Hash', 128, 128));
      break;
  }
  return await Promise.all(errors);
};

export const validateAgainstRegex = async (
  value: string,
  name: string,
  regex: RegExp,
  message: string
): Promise<string | null> => {
  return regex.test(value) ? `${name} ${message}` : null;
};

export const validateIsEmail = async (value: string): Promise<string | null> => {
  return !EmailValidator.validate(value) ? `Email must be valid` : null;
};

export const validateNotEmpty = async (value: string, name: string): Promise<string | null> => {
  return value === null || value === '' || value === undefined ? `${name} must not be empty` : null;
};

export const validateLength = async (
  value: string,
  valueName: string,
  min: number,
  max: number
): Promise<string | null> => {
  return value.length < min || value.length > max ? `${valueName} must be between ${min} and ${max} chracters` : null;
};

export const checkUniqueAttribute = async (type: string, value: string): Promise<boolean> => {
  const params = formSearchQuery(type, value);

  try {
    const result = await DB.query(params).promise();
    const resultItems = result.Items;

    return resultItems!.length !== 0;
  } catch (e) {
    console.error(e);
  }
  return false;
};
