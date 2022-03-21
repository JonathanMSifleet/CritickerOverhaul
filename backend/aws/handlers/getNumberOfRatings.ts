import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

import createDynamoSearchQuery from '../shared/functions/DynamoDB/createDynamoSearchQuery';

const dbClient = new DynamoDBClient({});

const getNumberOfRatings = async (event: { pathParameters: { username: string } }): Promise<any> => {
  const { username } = event.pathParameters;

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
  console.log('🚀 ~ file: getNumberOfRatings.ts ~ line 34 ~ getNumberOfRatings ~ result', result);
  process.exit();
};

export default getNumberOfRatings;
