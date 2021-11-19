import CryptoES from 'crypto-es';
import React, { useContext, useEffect, useState } from 'react';
import Button from '../../../../elements/Button/Button';
import Input from '../../../../elements/Input/Input';
import * as actionTypes from '../../../../hooks/store/actionTypes';
import Context from '../../../../hooks/store/context';
import { loginURL } from '../../../../shared/endpoints';
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
      async function postData() {
        let response = (await fetch(loginURL, {
          method: 'post',
          body: JSON.stringify(formInfo)
        })) as any;

        if (response.status === 200) {
          response = await response.json();

          const userDetails = {
            username: response.username,
            loggedIn: true,
            UID: response.UID
          };

          let expiryDate = new Date().getTime();
          expiryDate = expiryDate + 14400000; // four hours
          sessionStorage.setItem(
            'userData',
            JSON.stringify({ ...userDetails, expiryDate })
          );

          actions({
            type: actionTypes.setUserInfo,
            payload: userDetails
          });

          actions({
            type: actionTypes.setShowModal,
            payload: { showModal: false }
          });
        }
      }
      postData();
    }
  }, [shouldPost]);

  const inputChangedHandler = (eventValue: string, inputName: string): void => {
    setFormInfo({ ...formInfo, [inputName]: eventValue });
  };

  const login = async () => {
    const hashedPassword = CryptoES.SHA512(formInfo.password).toString();

    setFormInfo({ ...formInfo, password: hashedPassword });
    setShouldPost(true);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <ThirdPartyLogin />

      {/* Email input */}
      <div className={`${classes.InputWrapper} form-outline mb-4`}>
        <Input
          className={'form-control'}
          onChange={(event) =>
            inputChangedHandler(event.target.value!, 'email')
          }
          placeholder={'Email or username'}
          type={'email'}
        />
        <Input
          className={'form-control'}
          onChange={(event) =>
            inputChangedHandler(event.target.value!, 'password')
          }
          placeholder={'Password'}
          type={'password'}
        />
      </div>

      {/* 2 column grid layout */}
      <div className={`${classes.PasswordOptions} row mb-4`}>
        <div className="col-md-6 d-flex justify-content-center">
          {/* Checkbox */}
          <div className="form-check mb-3 mb-md-0">
            <label>
              <input
                checked
                className="form-check-input"
                type="checkbox"
                value=""
              />{' '}
              Remember me{' '}
            </label>
          </div>
        </div>

        <div className="col-md-6 d-flex justify-content-center">
          {/* Simple link */}
          <a href="#!">Forgot password?</a>
        </div>
      </div>

      {/* Submit button */}
      <div className={classes.SubmitButtonWrapper}>
        <Button
          className={`${classes.SubmitButton} btn btn-primary btn-block mb-4`}
          disabled={submitDisabled}
          onClick={() => login()}
          text={'Sign in'}
        />
      </div>
    </form>
  );
};

export default Login;
