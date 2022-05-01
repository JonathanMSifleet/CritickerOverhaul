import * as endpoints from '../../constants/endpoints';
import { FC, useEffect, useState } from 'preact/compat';
import Alert from '../../components/Alert/Alert';
import Button from '../../components/Button/Button';
import classes from './VerifyEmail.module.scss';
import httpRequest from '../../utils/httpRequest';
import PageView from '../../hoc/PageView/PageView';
import Spinner from '../../components/Spinner/Spinner';
import SpinnerButton from '../../components/SpinnerButton/SpinnerButton';

interface IUrlParams {
  path?: string;
  token?: string;
  username?: string;
}

const VerifyEmail: FC<IUrlParams> = ({ token, username }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [status, setStatus] = useState(null as null | string);
  const [statusMessage, setStatusMessage] = useState(null as null | string);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);

      try {
        const result = await httpRequest(`${endpoints.VERIFY_EMAIL}/${username}/${token}`, 'GET');

        if (result.statusCode === 204) {
          setStatusMessage('Your email has been verified, you may now login');
          setStatus('success');
        } else {
          setStatusMessage(`${result.message}, please try again or request a new verification email:`);
          setStatus('warning');
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const sendVerificationEmail = async (): Promise<void> => {
    setIsSendingEmail(true);

    try {
      await httpRequest(`${endpoints.SEND_VERIFICATION_EMAIL}/${username}`, 'GET');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <PageView backgroundCSS={classes.PageWrapper}>
      {!isLoading ? (
        <>
          <Alert className={classes.Alert} type={status!} text={statusMessage!} />
          {status === 'warning' ? (
            !isSendingEmail ? (
              <div className={classes.SendVerificationEmailButtonWrapper}>
                <Button onClick={sendVerificationEmail} text={'Resend verification email'} />
              </div>
            ) : (
              <SpinnerButton />
            )
          ) : null}
        </>
      ) : (
        <Spinner />
      )}
    </PageView>
  );
};

export default VerifyEmail;
