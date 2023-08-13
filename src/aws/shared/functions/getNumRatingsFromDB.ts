import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

import createDynamoSearchQuery from './queries/createDynamoSearchQuery';

const getNumRatingsFromDB = async (dbClient: DynamoDBClient, username: string): Promise<number> => {
  const query = createDynamoSearchQuery(
    process.env.RATINGS_TABLE_NAME!,
    undefined,
    'username',
    username,
    'S',
    'username'
  );
  query.Select = 'COUNT';

  const result = await dbClient.send(new QueryCommand(query));
  return result.Count!;
};

export default getNumRatingsFromDB;
