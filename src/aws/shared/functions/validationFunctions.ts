import EmailValidator from 'email-validator';
import checkUniqueAttribute from './checkUniqueAttribute';

export const validateUserInputs = async (username: string, email: string): Promise<(string | null)[]> => {
  const errors = await Promise.all([
    checkUniqueAttribute('email', email, 'email'),
    checkUniqueAttribute('username', username, undefined),
    validateInput(username, 'Username'),
    validateInput(email, 'Email')
  ]);

  return errors.flat().filter((error) => error !== null);
};

export const validateInput = async (value: string, valueName: string): Promise<(string | null)[]> => {
  const errors = [];

  switch (valueName) {
    case 'Bio':
      errors.push(validateLength(value, valueName, 0, 1000));
      break;
    case 'Email':
      errors.push(validateNotEmpty(value, valueName), validateLength(value, valueName, 3, 256), validateIsEmail(value));
      break;
    case 'FirstName':
    case 'LastName':
      errors.push(
        validateLength(value, valueName, 0, 32),
        validateAgainstRegex(
          value,
          valueName,
          /[!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|0-9]/,
          'cannot contain numbers or special characters'
        )
      );
      break;
    case 'Password':
      errors.push(validateNotEmpty(value, valueName), validateLength(value, valueName, 8, 32));
      break;
    case 'Rating':
      errors.push(validateIsWholeNumber(value, valueName));
      if (errors.length !== 0) errors.push(validateValue(Number(value), valueName, 0, 100));
      break;
    case 'Review':
      errors.push(validateLength(value, valueName, 0, 500));
      break;
    case 'Username':
      errors.push(
        validateNotEmpty(value, valueName),
        validateLength(value, valueName, 3, 16),
        validateAgainstRegex(value, valueName, /[^A-Za-z0-9]+/, 'cannot contain special characters')
      );
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

export const validateIsWholeNumber = async (value: string, name: string): Promise<string | null> => {
  if (isNaN(Number(value))) return `${name} must be a whole number`;

  return value.includes('.') ? `${name} must not contain a decimal` : null;
};

export const validateLength = async (
  value: string,
  valueName: string,
  min: number,
  max: number
): Promise<string | null> =>
  value.length < min || value.length > max ? `${valueName} must be between ${min} and ${max} characters` : null;

export const validateNotEmpty = async (value: string, name: string): Promise<string | null> =>
  value === null || value === '' || value === undefined ? `${name} must not be empty` : null;

export const validateNotValue = async (value: string, name: string, match: string): Promise<string | null> =>
  value === match ? `${name} must not be ${match}` : null;

export const validateValue = async (
  value: number,
  name: string,
  lowerBound: number | undefined,
  upperBound: number | undefined
): Promise<string | null> =>
  value < lowerBound! || value > upperBound! ? `${name} must be between ${lowerBound} and ${upperBound}` : null;

export const validateWholeNumber = async (value: number, name: string): Promise<string | null> =>
  value.toString().includes('.') ? `${name} must be a whole number` : null;
