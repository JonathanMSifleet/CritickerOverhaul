import { AttributeValue, GetItemCommandInput } from '@aws-sdk/client-dynamodb';

const createDynamoSearchQuery = (
  tableName: string,
  primaryKeyName: string,
  primaryKeyType: string,
  keyValue: string,
  fields: string
): GetItemCommandInput => {
  return {
    TableName: tableName,
    Key: {
      [primaryKeyName]: { [primaryKeyType]: keyValue } as unknown as AttributeValue
    },
    ProjectionExpression: fields
  };
};

export default createDynamoSearchQuery;
