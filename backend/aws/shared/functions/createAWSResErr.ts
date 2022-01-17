import IHTTPErr from '../interfaces/IHTTPErr';

export const createAWSResErr = async (statusCode: number, message: string | string[]): Promise<IHTTPErr> => {
  if (Array.isArray(message)) {
    await logErrors(message);
  } else {
    console.error(message);
  }

  return {
    statusCode,
    statusText: {
      message
    }
  };
};

const logErrors = async (errors: string[]): Promise<void> => {
  console.error('Errors:');
  errors.forEach((element, i) => {
    console.error(`${i}) ${element}`);
  });
};
