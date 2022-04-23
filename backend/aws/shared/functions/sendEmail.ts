import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

const sendEmail = async (
  sesClient: SESClient,
  recipientEmailAddress: string,
  subject: string,
  message: string
): Promise<Error | undefined> => {
  try {
    const params = {
      Destination: {
        ToAddresses: [recipientEmailAddress]
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: subject
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: message
          }
        }
      },
      Source: process.env.SOURCE_EMAIL_ADDRESS!
    };

    await sesClient.send(new SendEmailCommand(params));

    return;
  } catch (error) {
    return new Error();
  }
};

export default sendEmail;
