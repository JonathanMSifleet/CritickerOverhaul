import CryptoES from 'crypto-es';
import { useContext, useEffect, useState } from 'react';
import Button from '../../../../elements/Button/Button';
import Input from '../../../../elements/Input/Input';
import * as actionTypes from '../../../../hooks/store/actionTypes';
import Context from '../../../../hooks/store/context';
import { LOGIN } from '../../../../shared/constants/endpoints';
import HTTPRequest from '../../../../shared/functions/HTTPRequest';
import ThirdPartyLogin from '../ThirdPartyLogin/ThirdPartyLogin';
import classes from './Login.module.scss';

interface IState {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [formInfo, setFormInfo] = useState<IState>({});
  const [shouldPost, setShouldPost] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const { actions } = useContext(Context);

  // see signup.tsx comment for why this is here
  useEffect(() => {
    if (!formInfo.email || !formInfo.password) {
      setSubmitDisabled(true);
    } else {
      setSubmitDisabled(false);
    }
  }, [formInfo]);

  useEffect(() => {
    if (shouldPost) {
      const postData = async (): Promise<void> => {
        try {
          const response = (await HTTPRequest(LOGIN, 'POST', formInfo)) as { username: string; UID: string };

          const userDetails = {
            username: response.username,
            loggedIn: true,
            UID: response.UID
          };

          let expiryDate = new Date().getTime();
          expiryDate = expiryDate + 14400000; // four hours
          sessionStorage.setItem('userData', JSON.stringify({ ...userDetails, expiryDate }));

          actions({
            type: actionTypes.setUserInfo,
            payload: userDetails
          });

          actions({
            type: actionTypes.setShowModal,
            payload: { showModal: false }
          });
        } catch (e) {}
      };
      postData();
    }
  }, [shouldPost]);

  const inputChangedHandler = (eventValue: string, inputName: string): void => {
    setFormInfo({ ...formInfo, [inputName]: eventValue });
  };

  const login = async (): Promise<void> => {
    const hashedPassword = CryptoES.SHA512(formInfo.password).toString();

    setFormInfo({ ...formInfo, password: hashedPassword });
    setShouldPost(true);
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
    <form
      onSubmit={(event): void => {
        event.preventDefault();
      }}
    >
      <ThirdPartyLogin />

      {/* Email input */}
      <div className={`${classes.InputWrapper} form-outline mb-4`}>
        <Input
          autoComplete="new-password"
          onChange={(event): void => inputChangedHandler(event.target.value!, 'email')}
          placeholder={handlePlaceholderText('email')}
          type={'email'}
        />
        <Input
          autoComplete="new-password"
          onChange={(event): void => inputChangedHandler(event.target.value!, 'password')}
          placeholder={handlePlaceholderText('password')}
          type={'password'}
        />
      </div>

      {/* 2 column grid layout */}
      <div className={`${classes.PasswordOptions}`}>
        {/* Simple link */}
        <a href="#!">Forgot password?</a>
      </div>

      {/* Submit button */}
      <div className={classes.SubmitButtonWrapper}>
        <Button
          className={`${classes.SubmitButton} btn btn-primary btn-block mb-4`}
          disabled={submitDisabled}
          onClick={(): Promise<void> => login()}
          text={'Sign in'}
        />
      </div>
    </form>
  );
};

export default Login;
