import createAWSResErr from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import IHTTP from '../../interfaces/IHTTP';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});

const getProfileByUsername = async (event: { pathParameters: { username: string } }): Promise<IHTTP> => {
  const username = event.pathParameters.username;

  const query = {
    TableName: process.env.USER_TABLE_NAME!,
    Key: { username: { S: username } },
    ProjectionExpression:
      'avatar, bio, country, dob, email, firstName, gender, lastName, memberSince, numRatings, username'
  };

  try {
    const result = await dbClient.send(new GetItemCommand(query));
    if (!result.Item) return createAWSResErr(404, 'No user found');

    const user = unmarshall(result.Item);

    console.log('Sucessfully fetched user profile');
    return {
      statusCode: 200,
      body: JSON.stringify(user)
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(getProfileByUsername).use(cors());
