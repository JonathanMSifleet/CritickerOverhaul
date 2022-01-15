import DynamoDB from 'aws-sdk/clients/dynamodb';
import EmailValidator from 'email-validator';
import formSearchQuery from './formSearchQuery';
const DB = new DynamoDB.DocumentClient();

export const validateUserInputs = async (
  username: string,
  email: string,
  password: string
) => {
  let errors = (await Promise.all([
    validateValue(username, 'Username'),
    validateValue(email, 'Email'),
    validateValue(password, 'Password')
  ])) as any;

  errors = errors.flat();
  return await removeEmptyErrors(errors);
};

export const validateValue = async (value: string, valueName: string) => {
  const errors = [validateNotEmpty(value, valueName)];

  switch (valueName) {
    case 'Username':
      errors.push(
        validateLength(value, valueName, 3, 16),
        validateAgainstRegex(
          value,
          valueName,
          /[^A-Za-z0-9]+/,
          'cannot contain special characters'
        )
      );
      break;
    case 'Email':
      errors.push(
        validateNotEmpty(value, valueName),
        validateLength(value, valueName, 3, 256),
        validateIsEmail(value)
      );
      break;
    case 'Password':
      errors.push(
        validateNotEmpty(value, valueName),
        validateLength(value, 'Password Hash', 128, 128)
      );
      break;
    default:
      return 'Unexpected error';
  }
  return await Promise.all(errors);
};

export const validateAgainstRegex = async (
  value: string,
  name: string,
  regex: RegExp,
  message: string
) => {
  if (regex.test(value)) return `${name} ${message}`;
};

export const validateIsEmail = async (value: string) => {
  if (!EmailValidator.validate(value)) return `Email must be valid`;
};

export const validateNotEmpty = async (
  value: string,
  name: string
): Promise<string | undefined> => {
  if (value === null || value === '' || value === undefined)
    return `${name} must not be empty`;
};

export const validateLength = async (
  value: string,
  valueName: string,
  min: number,
  max: number
) => {
  if (value.length < min || value.length > max) {
    return `${valueName} must be between ${min} and ${max} chracters`;
  }
};

export const checkUniqueAttribute = async (type: string, value: string) => {
  const params = formSearchQuery(type, value);

  try {
    const result = await DB.query(params).promise();
    const resultItems = result.Items;

    return resultItems!.length !== 0;
  } catch (e) {
    console.error(e);
  }
};

export const removeEmptyErrors = async (errors: string[]) => {
  let arrayLength = errors.length;
  while (arrayLength--) {
    if (errors[arrayLength] === undefined) errors.splice(arrayLength, 1);
  }
  return errors;
};
