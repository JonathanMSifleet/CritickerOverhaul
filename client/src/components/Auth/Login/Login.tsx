import * as endpoints from '../../../constants/endpoints';
import { authModalState, userInfoState } from '../../../store';
import { FC, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import Button from '../../Button/Button';
import classes from './Login.module.scss';
import CryptoES from 'crypto-es';
import extractValidationMessages from '../../../utils/extractValidationMessages';
import httpRequest from '../../../utils/httpRequest';
import Input from '../../Input/Input';
import SpinnerButton from './../../SpinnerButton/SpinnerButton';

interface IState {
  email?: string;
  password?: string;
}

const Login: FC = () => {
  const [emailValidationMessages, setEmailValidationMessages] = useState([] as string[]);
  const [passwordValidationMessages, setPasswordValidationMessages] = useState([] as string[]);
  const [formInfo, setFormInfo] = useState<IState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState(null as null | string);
  const [showEmailAddressInput, setShowEmailAddressInput] = useState(false);
  const [shouldLogin, setShouldLogin] = useState(false);
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
    const hashedPassword = CryptoES.SHA512(formInfo.password).toString();

    setFormInfo({ ...formInfo, password: hashedPassword });
    setShouldLogin(true);
  };

  const sendResetEmailPassword = async (): Promise<void> => {
    const result = await httpRequest(`${endpoints.SEND_RESET_PASSWORD_EMAIL}/${resetPasswordEmail}`, 'PUT');
    console.log('🚀 ~ file: Login.tsx ~ line 99 ~ sendResetEmailPassword ~ result', result);
  };

  const toggleEmailInput = (): void => setShowEmailAddressInput(!showEmailAddressInput);

  return (
    <form onSubmit={(event): void => event.preventDefault()}>
      <div className={`${classes.InputWrapper} form-outline mb-4`}>
        <Input
          autoComplete="email"
          className={classes.Input}
          errors={emailValidationMessages}
          onChange={(event: { target: { value: string } }): void => inputChangedHandler(event.target.value!, 'email')}
          placeholder={'Email'}
          type={'email'}
        />
        <Input
          autoComplete="current-password"
          className={classes.Input}
          errors={passwordValidationMessages}
          onChange={(event: { target: { value: string } }): void =>
            inputChangedHandler(event.target.value!, 'password')
          }
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
        <div className={classes.InputWrapper}>
          <Input
            onChange={(event): void => setResetPasswordEmail(event.target.value)}
            className={classes.Input}
            placeholder={'Email'}
            type={'email'}
          />
        </div>
      ) : null}

      <div className={classes.SubmitButtonWrapper}>
        {showEmailAddressInput ? (
          <Button
            className={`${classes.SubmitButton} btn btn-primary btn-block mb-4`}
            // disabled={}
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
