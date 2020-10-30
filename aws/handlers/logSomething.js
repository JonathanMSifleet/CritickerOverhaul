// import AWS from 'aws-sdk';
// const dynamodb = new AWS.DynamoDB.DocumentClient();

async function logSomething(event, context) {
  console.log('do stuff...');
}

export const handler = logSomething;
