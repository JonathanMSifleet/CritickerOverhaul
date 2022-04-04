import { UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';

const createDynamoUpdateQuery = (
  tableName: string,
  primaryKeyName: string,
  primaryKeyValue: string,
  primaryKeyType: string,
  updateKeyName: string,
  updateKeyValue: string,
  updateKeyType: string,
  rangeKeyName?: string,
  rangeKeyValue?: string,
  rangeKeyType?: string
): UpdateItemCommandInput => {
  let query = {
    TableName: tableName,
    Key: {
      [primaryKeyName]: { [primaryKeyType]: primaryKeyValue }
    },
    UpdateExpression: `set ${updateKeyName} = :${updateKeyName}`,
    ExpressionAttributeValues: {
      [`:${updateKeyName}`]: { [updateKeyType]: updateKeyValue }
    },
    ReturnValues: 'UPDATED_NEW'
  } as unknown as UpdateItemCommandInput;

  // @ts-expect-error Key works as intended
  if (rangeKeyName) query = { ...query, Key: { ...query.Key, [rangeKeyName]: { [rangeKeyType!]: rangeKeyValue } } };

  return query;
};

export default createDynamoUpdateQuery;
