import createAWSResErr from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuid } from 'uuid';
import cors from '@middy/http-cors';
import getUsername from '../../shared/functions/getUsername';
import IHTTP from '../../interfaces/IHTTP';
import middy from '@middy/core';
import sendEmail from '../../shared/functions/sendEmail';
import sendGrid from '@sendgrid/mail';

const dbClient = new DynamoDBClient({});

const sendResetPasswordEmail = async (event: { pathParameters: { emailAddress: string } }): Promise<IHTTP> => {
  try {
    const emailAddress = event.pathParameters.emailAddress;

    const token = uuid();
    const url = `https://dpldmuafup7cw.cloudfront.net/#/passwordReset/${emailAddress}/${token}`;

    const username = await getUsername(dbClient, emailAddress);
    if (username instanceof Error) return createAWSResErr(500, 'Unable to find username');

    const tokenResult = await storeToken(username, token);
    if (tokenResult instanceof Error) return createAWSResErr(500, 'Unable to store token');

    const emailContent = `<p>Please follow the link below, and follow the instructions:</p><br><p>${url}</p>`;

    const emailResult = await sendEmail(sendGrid, emailAddress, 'CritickerOverhaul Password Reset', emailContent);
    if (emailResult instanceof Error) return createAWSResErr(500, 'Unable to send email');

    return { statusCode: 204 };
  } catch (error) {
    console.log('🚀 ~ file: sendResetPasswordEmail.ts ~ line 30 ~ sendResetPasswordEmail ~ error', error);
    process.exit();
  }
};

export const handler = middy(sendResetPasswordEmail).use(cors());

const storeToken = async (username: string, token: string): Promise<void | Error> => {
  const jsonToken = JSON.stringify({ token, expires: Date.now() + 10 * 60 * 1000 });

  const params = {
    TableName: process.env.USER_TABLE_NAME!,
    Key: {
      username: { S: username }
    },
    UpdateExpression: 'set resetPasswordToken = :resetPasswordToken',
    ExpressionAttributeValues: {
      ':resetPasswordToken': { S: jsonToken }
    },
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    await dbClient.send(new UpdateItemCommand(params));

    console.log('Successfully stored token');
    return;
  } catch (error) {
    console.log('🚀 ~ file: sendResetPasswordEmail.ts ~ line 57 ~ storeToken ~ error', error);
    throw new Error();
  }
};
