import * as endpoints from '../../constants/endpoints';
import { FC } from 'preact/compat';
import { route } from 'preact-router';
// @ts-expect-error no declaration file
import { SHA512 } from 'crypto-es/lib/sha512.js';
import { useEffect, useState } from 'preact/hooks';
import { validateValue } from '../../../../shared/functions/validationFunctions';
import Button from '../../components/Button/Button';
import classes from './PasswordReset.module.scss';
import httpRequest from '../../utils/httpRequest';
import Input from '../../components/Input/Input';
import PageView from '../../hoc/PageView/PageView';
import Spinner from '../../components/Spinner/Spinner';

interface IFormInfo {
  password: string;
  repeatPassword: string;
}

interface IUrlParams {
  emailAddress?: string;
  path?: string;
  token?: string;
}

const PasswordReset: FC<IUrlParams> = ({ emailAddress, token }) => {
  const [formInfo, setFormInfo] = useState<IFormInfo>({
    password: '',
    repeatPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValMessages, setPasswordValMessages] = useState<string[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState(null as null | number);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [tokenValid, setTokenValid] = useState(null as null | boolean);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    (async (): Promise<void> => {
      let messages = (await validateValue(formInfo.password!, 'Password')) as string[];
      messages = messages.filter((error) => error !== null);

      if (formInfo.password !== formInfo.repeatPassword) messages.push('Passwords do not match');

      setPasswordValMessages(messages);
    })();
  }, [formInfo.password, formInfo.repeatPassword]);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);

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
      } finally {
        setIsLoading(false);
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

  const inputChangedHandler = (value: string, inputName: string): void =>
    setFormInfo({ ...formInfo!, [inputName]: value });

  const updatePassword = async (): Promise<void> => {
    try {
      const hashedPassword = SHA512(formInfo.password).toString();

      const result = await httpRequest(`${endpoints.UPDATE_PASSWORD}/${emailAddress}`, 'PUT', undefined, {
        password: hashedPassword
      });
      console.log('🚀 ~ file: PasswordReset.tsx ~ line 88 ~ updatePassword ~ result', result);
    } catch (error) {
      console.log('🚀 ~ file: PasswordReset.tsx ~ line 90 ~ updatePassword ~ error', error);
    }
  };

  const validatePassword = async (value: string): Promise<void> => {
    let messages = (await validateValue(value, 'Password')) as string[];
    messages = messages.filter((error) => error !== null);

    setPasswordValMessages(messages);
  };

  return (
    <PageView backgroundCSS={classes.PageWrapper}>
      {!isLoading ? (
        <div>
          {tokenValid ? (
            <div className={classes.FormWrapper}>
              <p className={classes.Instructions}>Please enter your new password:</p>
              <div className={classes.Form}>
                <Input
                  errors={passwordValMessages}
                  onChange={(event): void => {
                    inputChangedHandler(event.target.value, 'password');
                    validatePassword(event.target.value);
                  }}
                  placeholder={'New password'}
                  type={'password'}
                />

                <div className={classes.RepeatPasswordWrapper}>
                  <Input
                    onChange={(event): void => {
                      inputChangedHandler(event.target.value, 'repeatPassword');
                    }}
                    placeholder={'Repeat password'}
                    type={'password'}
                  />
                </div>
              </div>
              <Button disabled={passwordValMessages.length !== 0} onClick={updatePassword} text={'Submit'}></Button>
            </div>
          ) : (
            <>
              <p>{validationMessage}</p>
              <p>Redirecting in {secondsRemaining} seconds</p>
            </>
          )}
        </div>
      ) : (
        <Spinner />
      )}
    </PageView>
  );
};

export default PasswordReset;
