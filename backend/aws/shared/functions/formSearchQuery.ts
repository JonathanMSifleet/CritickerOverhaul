import DynamoDB from 'aws-sdk/clients/dynamodb';

const formSearchQuery = (type: string, value: string): DynamoDB.DocumentClient.QueryInput => {
  switch (type) {
    case 'email':
      return {
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
    case 'username':
      return {
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
    case 'UID':
      return {
        TableName: process.env.USER_TABLE_NAME!,
        KeyConditionExpression: '#UID = :UID',
        ExpressionAttributeNames: {
          '#UID': 'UID'
        },
        ExpressionAttributeValues: {
          ':UID': value
        }
      };
  }
};

export default formSearchQuery;
