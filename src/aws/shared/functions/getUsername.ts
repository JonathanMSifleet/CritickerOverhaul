import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import createDynamoSearchQuery from './queries/createDynamoSearchQuery';

const getUsername = async (dbClient: DynamoDBClient, email: string): Promise<string | Error> => {
  const query = createDynamoSearchQuery(process.env.USER_TABLE_NAME!, 'username', 'email', email, 'S', 'email');

  try {
    const results = await dbClient.send(new QueryCommand(query));
    return unmarshall(results.Items![0]).username;
  } catch (error) {
    return new Error();
  }
};

export default getUsername;
