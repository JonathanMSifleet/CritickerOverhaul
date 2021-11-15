import EmailValidator from 'email-validator';

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
