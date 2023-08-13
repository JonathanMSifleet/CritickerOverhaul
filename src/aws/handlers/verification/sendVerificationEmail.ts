import createAWSResErr from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import IHTTP from '../../interfaces/IHTTP';
import middy from '@middy/core';
import sendEmail from '../../shared/functions/sendEmail';
import sendGrid from '@sendgrid/mail';
import storeVerificationToken from '../../shared/functions/storeVerificationToken';

const dbClient = new DynamoDBClient({});

const sendVerificationEmail = async (event: { pathParameters: { username: string } }): Promise<IHTTP> => {
  const username = event.pathParameters.username;

  const email = await getEmail(username);
  if (email instanceof Error) return createAWSResErr(404, 'User not found');

  const token = await storeVerificationToken(dbClient, username);

  const emailContent =
    '<p>Please go to the link below to verify your email address:</p><br>' +
    `<p>https://dpldmuafup7cw.cloudfront.net/#/verifyEmail/${username}/${token}</p>`;

  try {
    await sendEmail(sendGrid, email, 'Criticker Overhaul - Verify email address', emailContent);

    return {
      statusCode: 204
    };
  } catch (error) {
    return createAWSResErr(500, 'Failed to send verification email');
  }
};

export const handler = middy(sendVerificationEmail).use(cors());

const getEmail = async (username: string): Promise<string | Error> => {
  const params = {
    TableName: process.env.USER_TABLE_NAME,
    Key: {
      username: { S: username }
    },
    ProjectionExpression: 'email'
  };

  try {
    const result = await dbClient.send(new GetItemCommand(params));
    return unmarshall(result.Item!).email;
  } catch (error) {
    return new Error();
  }
};
