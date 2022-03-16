import IHTTP from '../interfaces/IHTTP';

export const createAWSResErr = async (statusCode: number, message: string | string[]): Promise<IHTTP> => {
  if (Array.isArray(message)) {
    await logErrors(message);
    message = message.join('\n');
  } else {
    console.error(message);
  }

  return {
    statusCode,
    body: JSON.stringify({ statusCode, message })
  };
};

const logErrors = async (errors: string[]): Promise<void> => {
  console.error('Errors:');
  errors.forEach((element, i) => console.error(`${i}) ${element}`));
};
