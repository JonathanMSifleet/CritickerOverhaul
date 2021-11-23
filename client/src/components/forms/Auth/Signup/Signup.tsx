import CryptoES from 'crypto-es';
import React, { useContext, useEffect, useState } from 'react';
import Button from '../../../../elements/Button/Button';
import Checkbox from '../../../../elements/Checkbox/Checkbox';
import Input from '../../../../elements/Input/Input';
import * as actionTypes from '../../../../hooks/store/actionTypes';
import Context from '../../../../hooks/store/context';
import { signupURL } from '../../../../shared/endpoints';
import ThirdPartyLogin from '../ThirdPartyLogin/ThirdPartyLogin';
import classes from './Signup.module.scss';

interface IState {
  email?: string;
  password?: string;
  repeatPassword?: string;
  username?: string;
  termsChecked?: boolean;
}

const SignUp: React.FC = () => {
  const [formInfo, setFormInfo] = useState<IState>({});
  const [shouldPost, setShouldPost] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const { actions } = useContext(Context);

  useEffect(() => {
    if (
      !formInfo.email ||
      !formInfo.password ||
      !formInfo.repeatPassword ||
      !formInfo.username ||
      !formInfo.termsChecked
    ) {
      setSubmitDisabled(true);
    } else {
      setSubmitDisabled(false);
    }
  }, [formInfo]);

  // when hashing the password client-side, React does not update the
  // state until the next render-cycle, by using useEffect, a new render
  // cycle is called, updating the state to store the hashed password,
  // so that when it is POSTed to the server, the password is hashed
  useEffect(() => {
    if (shouldPost) {
      // trick to allows for await to be used inside a useEffect hook
      async function postData() {
        await fetch(signupURL, {
          method: 'post',
          body: JSON.stringify(formInfo)
        });

        actions({
          type: actionTypes.setShowModal,
          payload: { showModal: false }
        });
      }
      // stop POSTing unnecessary attribute
      delete formInfo!.repeatPassword;
      postData();
    }
  }, [shouldPost]);

  const signup = async () => {
    if (formInfo.password === formInfo.repeatPassword) {
      const hashedPassword = CryptoES.SHA512(formInfo.password).toString();

      setFormInfo({ ...formInfo, password: hashedPassword });
      setShouldPost(true);
    }
  };

  const inputChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    inputName: string
  ): void => {
    setFormInfo({ ...formInfo, [inputName]: event.target.value });
  };

  const checkboxHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormInfo({ ...formInfo, termsChecked: event.target.checked });
  };

  return (
    <form
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <ThirdPartyLogin />

      <div className={`${classes.InputWrapper} form-outline mb-4`}>
        {/* Username input */}
        <Input
          onChange={(event) => inputChangedHandler(event, 'username')}
          placeholder={'Username'}
          type={'text'}
        />

        {/* Email input */}
        <Input
          autoComplete="new-password"
          onChange={(event) => inputChangedHandler(event, 'email')}
          placeholder={'Email'}
          type={'email'}
        />

        {/* Password input */}
        <Input
          autoComplete="new-password"
          onChange={(event) => inputChangedHandler(event, 'password')}
          placeholder={'Password'}
          type={'password'}
        />

        {/* Repeat Password input */}
        <Input
          onChange={(event) => inputChangedHandler(event, 'repeatPassword')}
          placeholder={'Repeat password'}
          type={'password'}
        />
      </div>

      {/* Checkbox */}
      <div className={classes.TermsConditionsWrapper}>
        <label className={classes.TermsConditionsLabel}>
          <Checkbox
            onChange={(event) => checkboxHandler(event)}
            placeholder={'I have read and agree to the terms'}
            value={formInfo.termsChecked}
          />
        </label>
      </div>

      {/* Submit button */}
      <div className={classes.SubmitButtonWrapper}>
        <Button
          className={`${classes.SubmitButton} btn btn-primary btn-block mb-4`}
          disabled={submitDisabled}
          onClick={() => signup()}
          text={'Sign up'}
        />
      </div>
    </form>
  );
};
export default SignUp;
