import { MailService } from '@sendgrid/mail';

const sendEmail = async (
  sendGrid: MailService,
  recipientEmailAddress: string,
  subject: string,
  message: string
): Promise<Error | undefined> => {
  sendGrid.setApiKey(process.env.SENDGRID_API_KEY!);

  const params = {
    to: recipientEmailAddress,
    from: process.env.SOURCE_EMAIL_ADDRESS!,
    subject,
    html: message
  };

  try {
    await sendGrid.send(params);

    return;
  } catch (error) {
    return new Error();
  }
};

export default sendEmail;
