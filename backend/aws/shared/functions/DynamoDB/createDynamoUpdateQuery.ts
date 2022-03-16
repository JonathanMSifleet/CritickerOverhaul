import { UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';

const createDynamoUpdateQuery = (
  tableName: string,
  primaryKeyName: string,
  primaryKeyValue: string,
  primaryKeyType: string,
  updateKeyName: string,
  updateKeyValue: string | number,
  updateKeyType: string
): UpdateItemCommandInput => {
  const query = {
    TableName: tableName,
    Key: {
      [primaryKeyName]: { [primaryKeyType]: primaryKeyValue }
    },
    UpdateExpression: `set ${updateKeyName} = :${updateKeyName}`,
    ExpressionAttributeValues: {
      [`:${updateKeyName}`]: { [updateKeyType]: updateKeyValue.toString() }
    },
    ReturnValues: 'UPDATED_NEW'
  } as unknown as UpdateItemCommandInput;

  return query;
};

export default createDynamoUpdateQuery;
