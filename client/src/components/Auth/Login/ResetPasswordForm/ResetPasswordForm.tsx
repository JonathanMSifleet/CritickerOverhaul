import * as endpoints from '../../../../constants/endpoints';
import { FC, useEffect, useState } from 'preact/compat';
import { validateValue } from '../../../../../../shared/functions/validationFunctions';
import Alert from '../../../Alert/Alert';
import Button from '../../../Button/Button';
import classes from './ResetEmailForm.module.scss';
import httpRequest from '../../../../utils/httpRequest';
import Input from '../../../Input/Input';
import SpinnerButton from '../../../SpinnerButton/SpinnerButton';

interface IProps {
  toggleEmailInput: () => void;
}

const ResetEmailForm: FC<IProps> = ({ toggleEmailInput }) => {
  const [emailSentStatus, setEmailSentStatus] = useState(null as null | string);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState(null as null | string);
  const [resetPasswordValMessages, setResetPasswordValMessages] = useState([] as string[]);

  useEffect(() => {
    if (isSendingEmail) setEmailSentStatus(null);
  }, [isSendingEmail]);

  const sendResetEmailPassword = async (): Promise<void> => {
    setIsSendingEmail(true);

    try {
      const result = await httpRequest(`${endpoints.SEND_RESET_PASSWORD_EMAIL}/${resetPasswordEmail}`, 'PUT');
      result.statusCode === 204
        ? setEmailSentStatus('Email sent successfully!')
        : setEmailSentStatus('Error sending email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const validateEmail = async (value: string): Promise<void> => {
    let messages = (await validateValue(value, 'Email')) as string[];
    messages = messages.filter((error) => error !== null);

    setResetPasswordValMessages(messages);
  };

  return (
    <>
      <p className={classes.ReturnToLogin} onClick={toggleEmailInput}>
        Return to login
      </p>

      <div className={classes.InputWrapper}>
        <Input
          errors={resetPasswordValMessages}
          onChange={(event): void => {
            setResetPasswordEmail(event.target.value);
            validateEmail(event.target.value);
          }}
          className={classes.Input}
          placeholder={'Email'}
          type={'email'}
        />
      </div>

      {emailSentStatus ? (
        <div className={classes.AlertWrapper}>
          <Alert text={emailSentStatus} type={emailSentStatus.includes('success') ? 'success' : 'warning'} />
        </div>
      ) : null}

      <div className={classes.SubmitButtonWrapper}>
        {!isSendingEmail ? (
          <Button
            className={`${classes.SubmitButton} btn btn-primary btn-block mb-4`}
            disabled={resetPasswordValMessages.length !== 0 || !resetPasswordEmail}
            onClick={sendResetEmailPassword}
            text={'Send reset password email'}
          />
        ) : (
          <SpinnerButton />
        )}
      </div>
    </>
  );
};

export default ResetEmailForm;
