export function createAWSResErr(code, message) {
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/json'
    },
    error: JSON.stringify(message)
  };
}
