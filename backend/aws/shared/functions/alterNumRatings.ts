import {
  DynamoDBClient,
  UpdateItemCommand,
  UpdateItemCommandInput
} from '@aws-sdk/client-dynamodb';
import IHTTP from '../interfaces/IHTTP';
import { createAWSResErr } from './createAWSResErr';
const dbClient = new DynamoDBClient({});

const alterNumRatings = async (UID: string, isAddition: boolean): Promise<void | IHTTP> => {
  let params = {
    TableName: process.env.USER_TABLE_NAME!,
    Key: {
      UID: { S: UID }
    },
    ExpressionAttributeValues: {
      ':val': { N: '1' }
    },
    ReturnValues: 'UPDATED_NEW'
  } as UpdateItemCommandInput;

  params = isAddition
    ? { ...params, UpdateExpression: 'set numRatings = numRatings + :val' }
    : { ...params, UpdateExpression: 'set numRatings = numRatings - :val' };

  try {
    await dbClient.send(new UpdateItemCommand(params));
    console.log('Number of ratings altered successfully');
    return;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Internal Server Error');
};

export default alterNumRatings;
