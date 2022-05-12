import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const getUserAvatarFromDB = async (dbClient: DynamoDBClient, username: string): Promise<string | Error> => {
  const query = {
    TableName: process.env.USER_TABLE_NAME!,
    Key: { username: { S: username } },
    ProjectionExpression: 'avatar',
    ReturnConsumedCapacity: 'TOTAL'
  };

  try {
    const result = await dbClient.send(new GetItemCommand(query));
    console.log('🚀 ~ file: getUserAvatarFromDB.ts ~ line 13 ~ getUserAvatarFromDB ~ result', result);
    return unmarshall(result.Item!).avatar;
  } catch (error) {
    return new Error();
  }
};

export default getUserAvatarFromDB;
