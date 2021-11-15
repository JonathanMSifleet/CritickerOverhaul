import DynamoDB from 'aws-sdk/clients/dynamodb';
import EmailValidator from 'email-validator';
const DB = new DynamoDB.DocumentClient();

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
