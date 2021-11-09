import { DynamoDB } from 'aws-sdk';
import IHTTP from '../interfaces/IHTTP';
import { createAWSResErr } from './createAWSResErr';
const DB = new DynamoDB.DocumentClient();

export const getReviewBySlug = async (
  slug: string
): Promise<string | IHTTP> => {
  try {
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: process.env.REVIEW_TABLE_NAME!,
      Key: { slug }
    };

    const result = (await DB.get(params).promise()) as { Item: any };
    return result!.Item;
  } catch (error: any) {
    return createAWSResErr(404, error);
  }
};
