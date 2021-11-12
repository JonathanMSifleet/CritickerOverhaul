import CryptoES from 'crypto-es';
import React, { useContext, useEffect, useState } from 'react';
import * as actionTypes from '../../../../hooks/store/actionTypes';
import Context from '../../../../hooks/store/context';
import Button from '../../../shared/Button/Button';
import Input from '../../../shared/Input/Input';
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
        let response = (await fetch(
          'https://fl6lwlunp9.execute-api.eu-west-2.amazonaws.com/dev/login',
          {
            method: 'post',
            body: JSON.stringify(formInfo)
          }
        )) as any;

        if (response.status === 201) {
          response = await response.json();

          actions({
            type: actionTypes.setUserInfo,
            payload: { username: response.username, loggedIn: true }
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

  const inputChangedHandler = (
    event: { target: { value: string } },
    inputName: string
  ): void => {
    setFormInfo({ ...formInfo, [inputName]: event.target.value });
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
          onChange={(event) => inputChangedHandler(event, 'email')}
          placeholder={'Email or username'}
          type={'email'}
        />
        <Input
          className={'form-control'}
          onChange={(event) => inputChangedHandler(event, 'password')}
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
