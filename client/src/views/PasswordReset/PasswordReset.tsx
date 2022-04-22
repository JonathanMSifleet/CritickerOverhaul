import * as endpoints from '../../constants/endpoints';
import { FC } from 'preact/compat';
import { route } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';
import Button from '../../components/Button/Button';
import httpRequest from '../../utils/httpRequest';
import Input from '../../components/Input/Input';
import PageView from '../../hoc/PageView/PageView';

interface IUrlParams {
  emailAddress?: string;
  path?: string;
  token?: string;
}

const PasswordReset: FC<IUrlParams> = ({ emailAddress, token }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(null as null | number);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [tokenValid, setTokenValid] = useState(null as null | boolean);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    console.log('🚀 ~ file: PasswordReset.tsx ~ line 25 ~ useEffect ~ shouldRedirect', shouldRedirect);
  }, [shouldRedirect]);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const result = await httpRequest(`${endpoints.VERIFY_PASSWORD_RESET_TOKEN}/${emailAddress}/${token}`, 'GET');

        if (result.statusCode === 204) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setValidationMessage(result.message);
          setShouldRedirect(true);
        }
      } catch (error) {
        setTokenValid(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (shouldRedirect)
      (async (): Promise<void> => {
        for (let i = 5; i > 0; i--) {
          setSecondsRemaining(i);
          await new Promise((resolve): NodeJS.Timeout => setTimeout(resolve, 1000));
        }
        route('/');
      })();
  }, [shouldRedirect]);

  const updatePassword = async (): Promise<void> => {
    return;
  };

  return (
    <PageView>
      <div>
        {tokenValid ? (
          <>
            <p>Please enter your new password:</p>
            <form>
              <Input placeholder={'New password'} type={'text'} />
              <Input placeholder={'Repeat password'} type={'text'} />
              <Button onClick={updatePassword} text={'Submit'}></Button>
              {/* <Button disabled={} onClick={updatePassword} text={'Submit'}></Button> */}
            </form>
          </>
        ) : (
          <>
            <p>{validationMessage}</p>
            <p>Redirecting in {secondsRemaining} seconds</p>
          </>
        )}
      </div>
    </PageView>
  );
};

export default PasswordReset;
