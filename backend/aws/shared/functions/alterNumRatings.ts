import { DynamoDBClient, UpdateItemCommand, UpdateItemCommandInput } from '@aws-sdk/client-dynamodb';

import IHTTP from '../interfaces/IHTTP';
import { createAWSResErr } from './createAWSResErr';

const dbClient = new DynamoDBClient({});

const alterNumRatings = async (username: string, isAddition: boolean): Promise<void | IHTTP> => {
  const params = {
    TableName: process.env.USER_TABLE_NAME!,
    Key: {
      username: { S: username }
    },
    ExpressionAttributeValues: {
      ':val': { N: '1' }
    },
    ReturnValues: 'UPDATED_NEW'
  } as UpdateItemCommandInput;

  params.UpdateExpression = isAddition ? 'set numRatings = numRatings + :val' : 'set numRatings = numRatings - :val';

  try {
    await dbClient.send(new UpdateItemCommand(params));
    console.log('Number of ratings altered successfully');
    return;
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export default alterNumRatings;
