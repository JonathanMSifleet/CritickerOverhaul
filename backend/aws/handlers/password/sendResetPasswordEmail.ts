import { createAWSResErr } from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { v4 as uuid } from 'uuid';
import cors from '@middy/http-cors';
import IHTTP from '../../shared/interfaces/IHTTP';
import middy from '@middy/core';

const dbClient = new DynamoDBClient({});
const sesClient = new SESClient({});

const sendResetPasswordEmail = async (event: { pathParameters: { emailAddress: string } }): Promise<IHTTP> => {
  const emailAddress = event.pathParameters.emailAddress;

  const token = uuid();
  const url = `http://localhost:3000/#/passwordReset/${emailAddress}/${token}`;

  const tokenResult = await storeToken(emailAddress, token);
  if (tokenResult instanceof Error) return createAWSResErr(500, 'Unable to store token');

  try {
    const params = {
      Destination: {
        ToAddresses: [emailAddress]
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<p>Please follow the link below, and follow the instructions:</p><br><p>${url}</p>`
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'CritickerOverhaul Password Reset'
        }
      },
      Source: 'jonathanmsifleet@gmail.com'
    };

    await sesClient.send(new SendEmailCommand(params));

    return { statusCode: 204 };
  } catch (error) {
    return createAWSResErr(500, 'Unable to send email');
  }
};

export const handler = middy(sendResetPasswordEmail).use(cors());

const storeToken = async (emailAddress: string, token: string): Promise<void | Error> => {
  const query = {
    TableName: process.env.RESET_PASSWORD_TOKENS_TABLE_NAME!,
    Item: marshall({
      emailAddress,
      token,
      expires: Date.now() + 5 * 60 * 1000
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
