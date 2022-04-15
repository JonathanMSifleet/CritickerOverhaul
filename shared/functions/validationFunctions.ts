import checkUniqueAttribute from '../../backend/aws/shared/functions/checkUniqueAttribute';
import EmailValidator from 'email-validator';

export const validateUserInputs = async (username: string, email: string): Promise<(string | null)[]> => {
  const errors = await Promise.all([
    checkUniqueAttribute('email', email, 'email'),
    checkUniqueAttribute('username', username, undefined),
    validateValue(username, 'Username'),
    validateValue(email, 'Email')
  ]);

  return errors.flat().filter((error) => error !== null);
};

export const validateValue = async (value: string, valueName: string): Promise<(string | null)[]> => {
  const errors = [];

  switch (valueName) {
    case 'Username':
      errors.push(
        validateNotEmpty(value, valueName),
        validateLength(value, valueName, 3, 16),
        validateAgainstRegex(value, valueName, /[^A-Za-z0-9]+/, 'cannot contain special characters')
      );
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
    case 'Bio':
      errors.push(validateLength(value, valueName, 0, 1000));
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

export const validateNotValue = async (value: string, name: string, match: string): Promise<string | null> =>
  value === match ? `${name} must not be ${match}` : null;

export const validateLength = async (
  value: string,
  valueName: string,
  min: number,
  max: number
): Promise<string | null> =>
  value.length < min || value.length > max ? `${valueName} must be between ${min} and ${max} characters` : null;
