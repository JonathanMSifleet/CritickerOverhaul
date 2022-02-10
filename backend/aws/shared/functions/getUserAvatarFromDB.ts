import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import IHTTP from '../interfaces/IHTTP';
import createDynamoSearchQuery from './createDynamoSearchQuery';
const dbClient = new DynamoDBClient({});

const getUserAvatarFromDB = async (username: string): Promise<any | IHTTP> => {
  const query = createDynamoSearchQuery(
    process.env.AVATAR_TABLE_NAME!,
    'image',
    'username',
    username,
    'S'
  );

  const result = await dbClient.send(new QueryCommand(query));
  return unmarshall(result.Items![0]).image;
};

export default getUserAvatarFromDB;
