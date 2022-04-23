import * as endpoints from '../../../constants/endpoints';
import { authModalState, userInfoState } from '../../../store';
import { FC, useEffect, useState } from 'react';
// @ts-expect-error no declaration file
import { SHA512 } from 'crypto-es/lib/sha512.js';
import { useSetRecoilState } from 'recoil';
import { validateValue } from '../../../../../shared/functions/validationFunctions';
import Button from '../../Button/Button';
import classes from './Login.module.scss';
import extractValidationMessages from '../../../utils/extractValidationMessages';
import httpRequest from '../../../utils/httpRequest';
import Input from '../../Input/Input';
import SpinnerButton from './../../SpinnerButton/SpinnerButton';

interface IState {
  email?: string;
  password?: string;
}

const Login: FC = () => {
  const [emailSentStatus, setEmailSentStatus] = useState(null as null | string);
  const [emailValidationMessages, setEmailValidationMessages] = useState([] as string[]);
  const [formInfo, setFormInfo] = useState<IState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidationMessages, setPasswordValidationMessages] = useState([] as string[]);
  const [resetPasswordEmail, setResetPasswordEmail] = useState(null as null | string);
  const [resetPasswordValMessages, setResetPasswordValMessages] = useState([] as string[]);
  const [shouldLogin, setShouldLogin] = useState(false);
  const [showEmailAddressInput, setShowEmailAddressInput] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
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
      switch (Object.keys(message)[0]) {
        case 'Email':
          const replacementEmailValList = emailValidationMessages;
          replacementEmailValList.push(`${Object.keys(message)[0]} ${message.Email}`);
          setEmailValidationMessages(replacementEmailValList);
          break;
        case 'Password':
          const replacementPasswordValList = passwordValidationMessages;
          replacementPasswordValList.push(`${Object.keys(message)[0]} ${message.Password}`);
          setPasswordValidationMessages(replacementPasswordValList);
          break;
        default:
          console.error('Unhandled validation key:', Object.keys(message)[0]);
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

  const sendResetEmailPassword = async (): Promise<void> => {
    const result = await httpRequest(`${endpoints.SEND_RESET_PASSWORD_EMAIL}/${resetPasswordEmail}`, 'PUT');
    result.statusCode === 204
      ? setEmailSentStatus('Email sent successfully!')
      : setEmailSentStatus('Error sending email');
  };

  const toggleEmailInput = (): void => setShowEmailAddressInput(!showEmailAddressInput);

  const validateEmail = async (value: string): Promise<void> => {
    let messages = (await validateValue(value, 'Email')) as string[];
    messages = messages.filter((error) => error !== null);

    setResetPasswordValMessages(messages);
  };

  return (
    <form onSubmit={(event): void => event.preventDefault()}>
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

      <div className={`${classes.PasswordOptions}`}>
        <p className={classes.ForgotPasswordText} onClick={toggleEmailInput}>
          Forgot password?
        </p>
      </div>

      {showEmailAddressInput ? (
        <>
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
          {emailSentStatus && showEmailAddressInput ? (
            <p
              className={`${classes.EmailSentStatus} ${
                emailSentStatus.includes('success') ? classes.SuccessMessage : classes.ErrorMesssage
              } `}
            >
              {emailSentStatus}
            </p>
          ) : null}
        </>
      ) : null}

      <div className={classes.SubmitButtonWrapper}>
        {showEmailAddressInput ? (
          <Button
            className={`${classes.SubmitButton} btn btn-primary btn-block mb-4`}
            disabled={resetPasswordValMessages.length !== 0 || !resetPasswordEmail}
            onClick={sendResetEmailPassword}
            text={'Send reset password email'}
          />
        ) : !isLoading ? (
          <Button
            className={`${classes.SubmitButton} btn btn-primary btn-block mb-4`}
            disabled={submitDisabled}
            onClick={(): Promise<void> => handleLoginAttempt()}
            text={'Sign in'}
          />
        ) : (
          <SpinnerButton />
        )}
      </div>
    </form>
  );
};

export default Login;
