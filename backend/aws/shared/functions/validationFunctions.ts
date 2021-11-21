import DynamoDB from 'aws-sdk/clients/dynamodb';
import EmailValidator from 'email-validator';
const DB = new DynamoDB.DocumentClient();

export const validateUserInputs = async (
  username: string,
  email: string,
  password: string
) => {
  const errors = [];

  errors.push(...(await validateValue(username, 'Username')));
  errors.push(...(await validateValue(email, 'Email')));
  errors.push(...(await validateValue(password, 'Password')));

  return errors;
};

export const validateValue = async (value: string, valueName: string) => {
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

export const checkUniqueAttribute = async (value: string, type: string) => {
  let params = <any>{};

  switch (type) {
    case 'email':
      params = {
        TableName: process.env.USER_TABLE_NAME!,
        IndexName: 'email',
        KeyConditionExpression: '#email = :email',
        ExpressionAttributeNames: {
          '#email': 'email'
        },
        ExpressionAttributeValues: {
          ':email': value
        }
      };
      break;
    case 'username':
      params = {
        TableName: process.env.USER_TABLE_NAME!,
        IndexName: 'username',
        KeyConditionExpression: '#username = :username',
        ExpressionAttributeNames: {
          '#username': 'username'
        },
        ExpressionAttributeValues: {
          ':username': value
        }
      };
      break;
  }

  try {
    const result = await DB.query(params).promise();
    const resultItems = result.Items;

    if (resultItems!.length !== 0) {
      return true;
    } else {
      return false;
    }
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
