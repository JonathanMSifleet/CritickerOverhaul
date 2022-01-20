import { AttributeValue, GetItemCommandInput } from '@aws-sdk/client-dynamodb';

const createDynamoSearchQuery = (
  tableName: string,
  primaryKeyName: string,
  type: string,
  keyValue: string,
  fields: string
): GetItemCommandInput => {
  return {
    TableName: tableName,
    Key: {
      [primaryKeyName]: { [type]: keyValue } as unknown as AttributeValue
    },
    ProjectionExpression: fields
  };
};

export default createDynamoSearchQuery;
