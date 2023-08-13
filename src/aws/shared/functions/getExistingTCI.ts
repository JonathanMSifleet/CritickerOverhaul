import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import ITCI from '../../interfaces/ITCI';

const getExistingTCI = async (dbClient: DynamoDBClient, username: string): Promise<ITCI[]> => {
  const query = {
    TableName: process.env.TCI_TABLE_NAME!,
    Key: { username: { S: username } },
    ProjectionExpression: 'TCIs'
  };

  try {
    const result = await dbClient.send(new GetItemCommand(query));
    return JSON.parse(unmarshall(result.Item!).TCIs);
  } catch (error) {
    return [];
  }
};

export default getExistingTCI;
