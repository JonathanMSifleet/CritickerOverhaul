export function createAWSResErr(code: number, message: any) {
  if (message.isArray()) {
    logErrors(message);
  } else {
    console.error(message);
  }

  return {
    statusCode: code,
    body: JSON.stringify(message)
  };
}

async function logErrors(errors: string[]) {
  let i = 0;
  errors.forEach((element) => {
    i++;
    console.error(`${i}) ${element}`);
  });
}
