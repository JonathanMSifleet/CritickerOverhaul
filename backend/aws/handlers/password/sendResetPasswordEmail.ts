import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuid } from 'uuid';
import cors from '@middy/http-cors';
import IHTTP from '../../shared/interfaces/IHTTP';
import middy from '@middy/core';
import sendEmail from '../../shared/functions/sendEmail';
import sendGrid from '@sendgrid/mail';

const dbClient = new DynamoDBClient({});

const sendResetPasswordEmail = async (event: { pathParameters: { emailAddress: string } }): Promise<IHTTP> => {
  const emailAddress = event.pathParameters.emailAddress;

  const token = uuid();
  const url = `http://localhost:3000/#/passwordReset/${emailAddress}/${token}`;

  const tokenResult = await storeToken(emailAddress, token);
  if (tokenResult instanceof Error) return createAWSResErr(500, 'Unable to store token');

  const emailContent = `<p>Please follow the link below, and follow the instructions:</p><br><p>${url}</p>`;

  const emailResult = await sendEmail(sendGrid, emailAddress, 'CritickerOverhaul Password Reset', emailContent);
  if (emailResult instanceof Error) return createAWSResErr(500, 'Unable to send email');

  return { statusCode: 204 };
};

export const handler = middy(sendResetPasswordEmail).use(cors());

const storeToken = async (emailAddress: string, token: string): Promise<void | Error> => {
  const query = {
    TableName: process.env.RESET_PASSWORD_TOKENS_TABLE_NAME!,
    Item: marshall({
      emailAddress,
      token,
      expires: Date.now() + 10 * 60 * 1000
    })
  };

  try {
    await dbClient.send(new PutItemCommand(query));

    console.log('Successfully stored token');
    return;
  } catch (error) {
    throw new Error();
  }
};
