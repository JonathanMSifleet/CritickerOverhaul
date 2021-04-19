import AWS, { DynamoDB } from 'aws-sdk';
import IHTTP from '../interfaces/IHTTP';
import { createAWSResErr } from './createAWSResErr';
const dynamodb = new AWS.DynamoDB.DocumentClient();

export const getReviewBySlug = async (
  slug: string
): Promise<string | IHTTP> => {
  try {
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: process.env.REVIEW_TABLE_NAME!,
      Key: { slug }
    };

    const result = (await dynamodb.get(params).promise()) as { Item: any };
    return result!.Item;
  } catch (error) {
    return createAWSResErr(404, error);
  }
};
