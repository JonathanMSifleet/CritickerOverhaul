import { QueryCommandInput } from '@aws-sdk/client-dynamodb';

const createDynamoSearchQuery = (
  tableName: string,
  fields: string | undefined,
  primaryKeyName: string,
  primaryKeyValue: string | number,
  primaryKeyType: string,
  indexName?: string,
  secondaryKeyName?: string,
  secondaryKeyValue?: string | number,
  secondaryKeyType?: string
): QueryCommandInput => {
  let query = {
    TableName: tableName,
    ProjectionExpression: fields,
    KeyConditionExpression: `${primaryKeyName} = :${primaryKeyName}`,
    ExpessionAttributeNames: {
      [primaryKeyName]: primaryKeyName
    },
    ExpressionAttributeValues: {
      [`:${primaryKeyName}`]: { [primaryKeyType]: primaryKeyValue }
    }
  } as unknown as QueryCommandInput;

  if (indexName) query = { ...query, IndexName: indexName };

  if (secondaryKeyName) {
    query = {
      ...query,
      KeyConditionExpression: `${primaryKeyName} = :${primaryKeyName} AND ${secondaryKeyName} = :${secondaryKeyName}`,
      ExpressionAttributeValues: {
        [`:${primaryKeyName}`]: { [primaryKeyType]: primaryKeyValue },
        [`:${secondaryKeyName}`]: { [secondaryKeyType!]: secondaryKeyValue }
      }
    } as unknown as QueryCommandInput;
  }

  return query;
};

export default createDynamoSearchQuery;
