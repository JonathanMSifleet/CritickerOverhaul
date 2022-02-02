import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import middy from '@middy/core';
import cors from '@middy/http-cors';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import createDynamoSearchQuery from '../shared/functions/createDynamoSearchQuery';
import IHTTP from '../shared/interfaces/IHTTP';
const dbClient = new DynamoDBClient({});

const getUserAvatar = async (event: { pathParameters: { UID: string } }): Promise<IHTTP> => {
  console.log('function invoked');
  const { UID } = event.pathParameters;

  try {
    const avatar = await getUserAvatarFromDB(UID);
    if (!avatar) return createAWSResErr(404, 'No image found');

    return {
      statusCode: 200,
      body: JSON.stringify(avatar)
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(404, error.message);
  }

  return createAWSResErr(500, 'Internal Server Error');
};

const getUserAvatarFromDB = async (UID: string): Promise<{ [key: string]: any } | IHTTP> => {
  const query = createDynamoSearchQuery(process.env.AVATAR_TABLE_NAME!, 'image', 'UID', UID, 'S');

  const result = await dbClient.send(new QueryCommand(query));
  const image = unmarshall(result.Items![0]).image;
  console.log('🚀 ~ file: getUserAvatar.ts ~ line 36 ~ getUserAvatarFromDB ~ image', image);
  return image;
};

export const handler = middy(getUserAvatar).use(cors());
