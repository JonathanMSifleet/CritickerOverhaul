import IHTTPErr from '../interfaces/IHTTPErr';

export const createAWSResErr = async (statusCode: number, message: unknown): Promise<IHTTPErr> => {
  console.log('Error:', message);

  if (Array.isArray(message)) {
    await logErrors(message);
  } else {
    console.error(message);
  }

  return {
    statusCode,
    statusText: {
      message: JSON.stringify(message)
    }
  };
};

const logErrors = async (errors: string[]): Promise<void> => {
  console.error('Errors:');
  errors.forEach((element, i) => {
    console.error(`${i}) ${element}`);
  });
};
