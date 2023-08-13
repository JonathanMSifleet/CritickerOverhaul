import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import createDynamoSearchQuery from './queries/createDynamoSearchQuery';

const getUserAvatarFromDB = async (dbClient: DynamoDBClient, username: string): Promise<string | Error> => {
  const query = createDynamoSearchQuery(process.env.USER_TABLE_NAME!, 'avatar', 'username', username, 'S');

  try {
    const result = await dbClient.send(new QueryCommand(query));
    return unmarshall(result.Items![0]).avatar;
  } catch (error) {
    return new Error();
  }
};

export default getUserAvatarFromDB;
