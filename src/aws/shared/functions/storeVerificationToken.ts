import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuid } from 'uuid';

const storeVerificationToken = async (dbClient: DynamoDBClient, username: string): Promise<string> => {
  const token = uuid();

  const query = {
    TableName: process.env.USER_TABLE_NAME!,
    Key: {
      username: { S: username }
    },
    UpdateExpression: 'set verificationToken = :token',
    ExpressionAttributeValues: {
      ':token': { S: token }
    },
    ReturnValues: 'UPDATED_NEW'
  };

  await dbClient.send(new UpdateItemCommand(query));
  return token;
};

export default storeVerificationToken;
