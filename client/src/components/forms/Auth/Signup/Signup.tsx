import CryptoES from 'crypto-es';
import React, { useEffect, useState } from 'react';
import Button from '../../../shared/Button/Button';
import Input from '../../../shared/Input/Input';
import ThirdPartyLogin from '../ThirdPartyLogin/ThirdPartyLogin';
import classes from './Signup.module.scss';

interface IState {
  username?: string;
  email?: string;
  password?: string;
  repeatPassword?: string;
}

const SignUp: React.FC = () => {
  const [formInfo, setFormInfo] = useState<IState>({});

  const [shouldPost, setShouldPost] = useState(false);

  const [submitDisabled, setSubmitDisabled] = useState(true);

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
    // trick to allows for await to be used inside a useEffect hook
    async function postData() {
      await fetch(
        'https://fl6lwlunp9.execute-api.eu-west-2.amazonaws.com/dev/signup',
        {
          method: 'post',
          body: JSON.stringify(formInfo)
        }
      );
    }
    // stop POSTing unnecessary attribute
    delete formInfo!.repeatPassword;
    postData();
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
          type={'text'}
          id={'registerUsername'}
          className={'form-control'}
          placeholder={'Username'}
          onChange={(event) => inputChangedHandler(event, 'username')}
        />

        {/* Email input */}
        <Input
          type={'email'}
          id={'registerEmail'}
          className={'form-control'}
          placeholder={'Email'}
          onChange={(event) => inputChangedHandler(event, 'email')}
        />

        {/* Password input */}
        <Input
          type={'password'}
          id={'registerPassword'}
          className={'form-control'}
          placeholder={'Password'}
          onChange={(event) => inputChangedHandler(event, 'password')}
        />

        {/* Repeat Password input */}
        <Input
          type={'password'}
          id={'registerRepeatPassword'}
          className={'form-control'}
          placeholder={'Repeat password'}
          onChange={(event) => inputChangedHandler(event, 'repeatPassword')}
        />
      </div>

      {/* Checkbox */}
      <div className={classes.TermsConditionsWrapper}>
        <label className={classes.TermsConditionsLabel}>
          <input
            checked
            className="form-check-input"
            id="registerCheck"
            type="checkbox"
          />
          I have read and agree to the terms
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
