import middy from '@middy/core';
import cors from '@middy/http-cors';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import formSearchQuery from '../shared/functions/formSearchQuery';
import IHTTP from '../shared/interfaces/IHTTP';
import IHTTPErr from '../shared/interfaces/IHTTPErr';
const DB = new DynamoDB.DocumentClient();

const getProfileByUsername = async (event: {
  pathParameters: { username: string };
}): Promise<IHTTP | IHTTPErr> => {
  const { username } = event.pathParameters;

  const params = formSearchQuery('username', username);

  try {
    const result = (await DB.query(params).promise()) as { Items: any };
    const user = result.Items[0];

    console.log('Sucessfully fetched user profile');
    return {
      statusCode: 200,
      body: JSON.stringify({
        username: user.username,
        UID: user.UID,
        memberSince: user.memberSince,
        numRatings: user.numRatings
      })
    };
  } catch (e: any) {
    return createAWSResErr(500, e);
  }
};

export const handler = middy(getProfileByUsername).use(cors());
