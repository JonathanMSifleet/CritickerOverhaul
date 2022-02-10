import CryptoES from 'crypto-es';
import { FC, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import * as endpoints from '../../../../constants/endpoints';
import { modalState, userInfoState } from '../../../../store';
import extractValidationMessages from '../../../../utils/extractValidationMessages';
import HTTPRequest from '../../../../utils/httpRequest';
import Button from '../../../elements/Button/Button';
import Input from '../../../elements/Input/Input';
import SpinnerButton from './../../SpinnerButton/SpinnerButton';
import classes from './Login.module.scss';

interface IState {
  email?: string;
  password?: string;
}

const Login: FC = () => {
  const [emailValidationMessages, setEmailValidationMessages] = useState([] as string[]);
  const [passwordValidationMessages, setPasswordValidationMessages] = useState([] as string[]);
  const [formInfo, setFormInfo] = useState<IState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [shouldLogin, setShouldLogin] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const setShowModal = useSetRecoilState(modalState);
  const setUserInfo = useSetRecoilState(userInfoState);

  useEffect(() => {
    setSubmitDisabled(!formInfo.email || !formInfo.password);
  }, [formInfo]);

  useEffect(() => {
    const attemptLogin = async (): Promise<void> => {
      setIsLoading(true);

      setEmailValidationMessages([]);
      setPasswordValidationMessages([]);

      try {
        const response = await HTTPRequest(endpoints.LOGIN, 'POST', formInfo);
        if (response.statusCode && !response.statusCode.toString().startsWith('2'))
          throw new Error(response.message);

        setUserInfo({
          ...response,
          loggedIn: true,
          expiryDate: new Date().getTime() + 4 * 60 * 60
        });

        setShowModal(false);
      } catch (error) {
        handleValidationMessage(extractValidationMessages(error as string));
      }

      setShouldLogin(false);
      setIsLoading(false);
    };

    if (shouldLogin) attemptLogin();
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

  const handlePlaceholderText = (type: string): string => {
    // @ts-expect-error type not required
    if (formInfo[type]) {
      return '';
    } else if (type === 'email') {
      return 'Email';
    } else {
      return 'Password';
    }
  };

  return (
    <form onSubmit={(event): void => event.preventDefault()}>
      <div className={`${classes.InputWrapper} form-outline mb-4`}>
        <Input
          onChange={(event: { target: { value: string } }): void =>
            inputChangedHandler(event.target.value!, 'email')
          }
          autoComplete="new-password"
          errors={emailValidationMessages}
          placeholder={handlePlaceholderText('email')}
          type={'email'}
        />
        <Input
          autoComplete="new-password"
          onChange={(event: { target: { value: string } }): void =>
            inputChangedHandler(event.target.value!, 'password')
          }
          errors={passwordValidationMessages}
          placeholder={handlePlaceholderText('password')}
          type={'password'}
        />
      </div>

      {/* to do */}
      <div className={`${classes.PasswordOptions}`}>
        <a href="#!">Forgot password?</a>
      </div>

      <div className={classes.SubmitButtonWrapper}>
        {!isLoading ? (
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
