export async function createAWSResErr(statusCode: number, message: any) {
  if (Array.isArray(message)) {
    await logErrors(message);
  } else {
    console.error(message);
  }

  return {
    statusCode,
    body: JSON.stringify(message)
  };
}

async function logErrors(errors: string[]) {
  console.error('Errors:');
  errors.forEach((element, i) => {
    console.error(`${i}) ${element}`);
  });
}
