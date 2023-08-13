import createAWSResErr from './createAWSResErr';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import createDynamoSearchQuery from './queries/createDynamoSearchQuery';
import IHTTP from '../../interfaces/IHTTP';
import IRating from '../../interfaces/IRating';

const getUserRatings = async (
  dbClient: DynamoDBClient,
  username: string,
  fields: string,
  options?: { [key: string]: boolean | number | string } | undefined
): Promise<IHTTP | IRating[]> => {
  let query = createDynamoSearchQuery(
    process.env.RATINGS_TABLE_NAME!,
    fields,
    'username',
    username,
    'S',
    'usernameRating'
  );

  if (options !== undefined) query = { ...query, ...options };

  try {
    const results = await dbClient.send(new QueryCommand(query));
    return results.Items!.map((result) => unmarshall(result) as IRating);
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export default getUserRatings;
