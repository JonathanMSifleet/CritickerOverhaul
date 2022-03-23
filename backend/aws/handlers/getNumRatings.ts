import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from '../shared/functions/DynamoDB/createDynamoSearchQuery';

const dbClient = new DynamoDBClient({});

const getNumRatings = async (event: { pathParameters: { username: string } }): Promise<any> => {
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

  try {
    const result = await dbClient.send(new QueryCommand(query));

    console.log('Successfully got number of ratings');
    return {
      statusCode: 200,
      body: JSON.stringify(result.Count)
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(getNumRatings).use(cors());
