import * as endpoints from '../../../constants/endpoints';
import { authModalState, userInfoState } from '../../../store';
import { FC } from 'preact/compat';
import { lazy, Suspense } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
// @ts-expect-error no declaration file
import { SHA512 } from 'crypto-es/lib/sha512.js';
import { useSetRecoilState } from 'recoil';
import Alert from '../../Alert/Alert';
import Button from '../../Button/Button';
import classes from './Login.module.scss';
import extractValidationMessages from '../../../utils/extractValidationMessages';
import httpRequest from '../../../utils/httpRequest';
import Input from '../../Input/Input';
import Spinner from '../../Spinner/Spinner';
import SpinnerButton from '../../SpinnerButton/SpinnerButton';

const ResetEmailForm = lazy(() => import('./ResetPasswordForm/ResetPasswordForm'));

interface IState {
  email?: string;
  password?: string;
}

const Login: FC = () => {
  const [emailValidationMessages, setEmailValidationMessages] = useState([] as string[]);
  const [formInfo, setFormInfo] = useState<IState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidationMessages, setPasswordValidationMessages] = useState([] as string[]);
  const [shouldLogin, setShouldLogin] = useState(false);
  const [showEmailAddressInput, setShowEmailAddressInput] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [verificationMessage, setVerificationMessage] = useState(null as null | string);
  const setShowModal = useSetRecoilState(authModalState);
  const setUserInfo = useSetRecoilState(userInfoState);

  useEffect(() => {
    setSubmitDisabled(!formInfo.email || !formInfo.password);
  }, [formInfo]);

  useEffect(() => {
    if (shouldLogin)
      (async (): Promise<void> => {
        setIsLoading(true);

        setEmailValidationMessages([]);
        setPasswordValidationMessages([]);

        try {
          const response = await httpRequest(endpoints.LOGIN, 'POST', undefined, formInfo);
          if (response.statusCode && !response.statusCode.toString().startsWith('2')) throw new Error(response.message);

          setUserInfo({
            accessToken: JSON.parse(response.accessToken),
            avatar: response.avatar,
            loggedIn: true,
            TCIs: response.TCIs,
            username: response.username
          });

          setShowModal(false);
        } catch (error) {
          handleValidationMessage(extractValidationMessages(error as string));
        } finally {
          setShouldLogin(false);
          setIsLoading(false);
        }
      })();
  }, [shouldLogin]);

  const handleValidationMessage = (valMessages: { [key: string]: string }[]): void => {
    valMessages.forEach((message) => {
      const errorKey = Object.keys(message)[0];

      switch (errorKey) {
        case 'Email':
          const replacementEmailValList = emailValidationMessages;
          replacementEmailValList.push(`${errorKey} ${message.Email}`);
          setEmailValidationMessages(replacementEmailValList);
          break;
        case 'Password':
          const replacementPasswordValList = passwordValidationMessages;
          replacementPasswordValList.push(`${errorKey} ${message.Password}`);
          setPasswordValidationMessages(replacementPasswordValList);
          break;
        case 'User':
          setVerificationMessage(`${errorKey} ${message.User}`);
          break;
        default:
          console.error('Unhandled validation key:', errorKey);
      }
    });
  };

  const inputChangedHandler = (eventValue: string, inputName: string): void =>
    setFormInfo({ ...formInfo, [inputName]: eventValue });

  const handleLoginAttempt = async (): Promise<void> => {
    const hashedPassword = SHA512(formInfo.password).toString();

    setFormInfo({ ...formInfo, password: hashedPassword });
    setShouldLogin(true);
  };

  const toggleEmailInput = (): void => setShowEmailAddressInput(!showEmailAddressInput);

  return (
    <>
      {!showEmailAddressInput ? (
        <>
          <div className={`${classes.InputWrapper} form-outline mb-4`}>
            <Input
              autoComplete="email"
              className={classes.Input}
              errors={emailValidationMessages}
              onChange={(event): void => inputChangedHandler(event.target.value!, 'email')}
              placeholder={'Email'}
              type={'email'}
            />
            <Input
              autoComplete="current-password"
              className={classes.Input}
              errors={passwordValidationMessages}
              onChange={(event): void => inputChangedHandler(event.target.value!, 'password')}
              placeholder={'Password'}
              type={'password'}
            />
          </div>

          {verificationMessage ? (
            <div className={classes.WarningWrapper}>
              <Alert text={verificationMessage} type={'warning'} />
            </div>
          ) : null}

          <div className={`${classes.PasswordOptions}`}>
            <p className={classes.ForgotPasswordText} onClick={toggleEmailInput}>
              Forgot password?
            </p>
          </div>

          <div className={classes.SubmitButtonWrapper}>
            {!showEmailAddressInput ? (
              !isLoading ? (
                <Button
                  className={`${classes.SubmitButton} btn btn-primary btn-block mb-4`}
                  disabled={submitDisabled}
                  onClick={(): Promise<void> => handleLoginAttempt()}
                  text={'Sign in'}
                />
              ) : (
                <SpinnerButton />
              )
            ) : null}
          </div>
        </>
      ) : (
        // @ts-expect-error
        <Suspense fallback={<Spinner />}>
          <ResetEmailForm toggleEmailInput={toggleEmailInput} />
        </Suspense>
      )}
    </>
  );
};

export default Login;
