import DynamoDB from 'aws-sdk/clients/dynamodb';
import { createAWSResErr } from './createAWSResErr';
const DB = new DynamoDB.DocumentClient();

const getUserAvatarFromS3 = async (username: string) => {
  try {
    const params: DynamoDB.DocumentClient.GetItemInput = {
      TableName: process.env.USER_AVATAR_BUCKET_NAME!,
      Key: { username }
    };

    const result = (await DB.get(params).promise()) as { Item: any };
    const itemToReturn = result!.Item;
    console.log(
      '🚀 ~ file: getUserAvatarFromS3.ts ~ line 14 ~ getUserAvatarFromS3 ~ itemToReturn',
      itemToReturn
    );
    return itemToReturn;
  } catch (error: any) {
    return createAWSResErr(404, error);
  }
};

export default getUserAvatarFromS3;
