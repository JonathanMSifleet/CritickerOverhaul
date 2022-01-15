import IHTTPErr from '../interfaces/IHTTPErr';

export const createAWSResErr = async (
  statusCode: number,
  message: string | string[]
): Promise<IHTTPErr> => {
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

const logErrors = async (errors: string[]) => {
  console.error('Errors:');
  errors.forEach((element, i) => {
    console.error(`${i}) ${element}`);
  });
};
