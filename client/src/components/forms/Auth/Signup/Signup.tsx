import CryptoES from 'crypto-es';
import React, { useContext, useEffect, useState } from 'react';
import { signupURL } from '../../../../endpoints';
import * as actionTypes from '../../../../hooks/store/actionTypes';
import Context from '../../../../hooks/store/context';
import Button from '../../../shared/Button/Button';
import Input from '../../../shared/Input/Input';
import ThirdPartyLogin from '../ThirdPartyLogin/ThirdPartyLogin';
import classes from './Signup.module.scss';

interface IState {
  email?: string;
  password?: string;
  repeatPassword?: string;
  username?: string;
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
      !formInfo.username
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

  const inputChangedHandler = (
    event: { target: { value: string } },
    inputName: string
  ): void => {
    setFormInfo({ ...formInfo, [inputName]: event.target.value });
  };

  const signup = async () => {
    if (formInfo.password === formInfo.repeatPassword) {
      const hashedPassword = CryptoES.SHA512(formInfo.password).toString();

      setFormInfo({ ...formInfo, password: hashedPassword });
      setShouldPost(true);
    } else {
      console.log('Passwords do not match');
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <ThirdPartyLogin />

      <div className={`${classes.InputWrapper} form-outline mb-4`}>
        {/* Username input */}
        <Input
          className={'form-control'}
          onChange={(event) => inputChangedHandler(event, 'username')}
          placeholder={'Username'}
          type={'text'}
        />

        {/* Email input */}
        <Input
          className={'form-control'}
          onChange={(event) => inputChangedHandler(event, 'email')}
          placeholder={'Email'}
          type={'email'}
        />

        {/* Password input */}
        <Input
          className={'form-control'}
          onChange={(event) => inputChangedHandler(event, 'password')}
          placeholder={'Password'}
          type={'password'}
        />

        {/* Repeat Password input */}
        <Input
          className={'form-control'}
          onChange={(event) => inputChangedHandler(event, 'repeatPassword')}
          placeholder={'Repeat password'}
          type={'password'}
        />
      </div>

      {/* Checkbox */}
      <div className={classes.TermsConditionsWrapper}>
        <label className={classes.TermsConditionsLabel}>
          <Input checked className="form-check-input" type="checkbox" />I have
          read and agree to the terms
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
