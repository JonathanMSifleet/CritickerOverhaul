export function createAWSResErr(code, message) {
  return {
    statusCode: code,
    body: JSON.stringify(message)
  };
}
