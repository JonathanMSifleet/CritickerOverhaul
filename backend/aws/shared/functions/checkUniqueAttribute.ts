import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import createDynamoSearchQuery from './queries/createDynamoSearchQuery';

const checkUniqueAttribute = async (keyName: string, keyValue: string, indexName?: string): Promise<string | null> => {
  const query = createDynamoSearchQuery(process.env.USER_TABLE_NAME!, keyName, keyName, keyValue, 'S', indexName);

  try {
    const dbClient = new DynamoDBClient({});
    const result = await dbClient.send(new QueryCommand(query));

    return result.Items![0] ? `${alphabeticalizeFirstChar(keyName)} already in use` : null;
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    return null;
  }
};

export default checkUniqueAttribute;

const alphabeticalizeFirstChar = (input: string): string => input.charAt(0).toUpperCase() + input.slice(1);
