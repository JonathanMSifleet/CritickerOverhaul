import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

import createDynamoSearchQuery from './DynamoDB/createDynamoSearchQuery';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const dbClient = new DynamoDBClient({});

const getUserAvatarFromDB = async (username: string): Promise<string | Error> => {
  const query = createDynamoSearchQuery(process.env.AVATAR_TABLE_NAME!, 'image', 'username', username, 'S');

  try {
    const result = await dbClient.send(new QueryCommand(query));
    return unmarshall(result.Items![0]).image;
  } catch (error) {
    return new Error();
  }
};

export default getUserAvatarFromDB;
