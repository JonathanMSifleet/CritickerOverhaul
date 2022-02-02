import { QueryCommandInput } from '@aws-sdk/client-dynamodb';

const createDynamoSearchQuery = (
  tableName: string,
  fields: string,
  primaryKeyName: string,
  primaryKeyValue: string,
  primaryKeyType: string,
  indexName?: string
): QueryCommandInput => {
  return {
    TableName: tableName,
    IndexName: indexName,
    ProjectionExpression: fields,
    KeyConditionExpression: `${primaryKeyName} = :${primaryKeyName}`,
    ExpressionAttributeValues: {
      [`:${primaryKeyName}`]: { [primaryKeyType]: primaryKeyValue }
    }
  } as unknown as QueryCommandInput;
};

export default createDynamoSearchQuery;
