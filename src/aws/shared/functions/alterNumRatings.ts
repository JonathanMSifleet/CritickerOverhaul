import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import createAWSResErr from './createAWSResErr';
import IHTTP from '../../interfaces/IHTTP';

const alterNumRatings = async (dbClient: DynamoDBClient, username: string, value: number): Promise<number | IHTTP> => {
  const params = {
    TableName: process.env.USER_TABLE_NAME!,
    Key: {
      username: { S: username }
    },
    UpdateExpression: 'set numRatings = numRatings + :val',
    ExpressionAttributeValues: {
      ':val': { N: value.toString() }
    },
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    const result = await dbClient.send(new UpdateItemCommand(params));

    console.log('Number of ratings altered successfully');
    return Number(result.Attributes!.numRatings.N);
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(520, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export default alterNumRatings;
