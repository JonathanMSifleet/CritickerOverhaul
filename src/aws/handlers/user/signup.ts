import createAWSResErr from '../../shared/functions/createAWSResErr';
import { DynamoDBClient, PutItemCommand, PutItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import cors from '@middy/http-cors';
import generateAccessToken from '../../shared/functions/generateAccessToken';
import IHTTP from '../../interfaces/IHTTP';
import middy from '@middy/core';
import sendEmail from '../../shared/functions/sendEmail';
import sendGrid from '@sendgrid/mail';
import storeVerificationToken from '../../shared/functions/storeVerificationToken';
import IAccessToken from '../../interfaces/IAccessToken';
import { validateUserInputs } from '../../shared/functions/validationFunctions';
import bcrypt from 'bcryptjs';

const dbClient = new DynamoDBClient({});

const signup = async (event: { body: string }): Promise<IHTTP> => {
  const password = JSON.parse(event.body).password;
  let { username, email } = JSON.parse(event.body);

  username = username.trim();
  email = email.trim();

  const errors = await validateUserInputs(username, email);
  if (errors.length !== 0) return createAWSResErr(422, errors as string[]);

  const memberSince = getSignupDate();
  const accessToken = (await generateAccessToken()) as IAccessToken;

  try {
    const salt = bcrypt.genSaltSync(10);
    await insertUserToDB(username, email, bcrypt.hashSync(password, salt), memberSince, accessToken);

    console.log('Signed up successfully');

    const token = await storeVerificationToken(dbClient, username);

    const emailContent =
      '<p>Please go to the link below to verify your email address:</p><br>' +
      `<p>https://dpldmuafup7cw.cloudfront.net/#/verifyEmail/${username}/${token}</p>`;

    try {
      await sendEmail(sendGrid, email, 'Criticker Overhaul - Verify email address', emailContent);
    } catch (error) {
      return createAWSResErr(500, 'Failed to send verification email');
    }

    return {
      statusCode: 201,
      body: JSON.stringify('Signup successful')
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, error.message);
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export const handler = middy(signup).use(cors());

const getSignupDate = (): number => Math.floor(Date.now() / (24 * 60 * 60)) * 24 * 60 * 60;

const insertUserToDB = async (
  username: string,
  email: string,
  password: string,
  memberSince: number,
  accessToken: IAccessToken
): Promise<PutItemCommandOutput> => {
  const params = {
    TableName: process.env.USER_TABLE_NAME!,
    Item: marshall({
      accessToken: JSON.stringify(accessToken),
      email,
      isVerified: false,
      memberSince,
      numRatings: 0,
      password,
      username
    }),
    ReturnConsumedCapacity: 'TOTAL'
  };

  return await dbClient.send(new PutItemCommand(params));
};
