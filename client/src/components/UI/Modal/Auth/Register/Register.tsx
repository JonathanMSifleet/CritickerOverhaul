import React, { useState } from 'react';
import Button from '../../../../shared/Button/Button';
import Input from '../../../../shared/Input/Input';
import ThirdPartyLogin from '../ThirdPartyLogin/ThirdPartyLogin';
import classes from './Register.module.scss';

interface IStateProps {
  username?: string;
  email?: string;
  password?: string;
}

const Register: React.FC = () => {
  const [formInfo, setFormInfo] = useState<IStateProps>({
    username: '',
    email: '',
    password: ''
  });

  const inputChangedHandler = (
    event: { target: { value: string } },
    inputName: string
  ): void => {
    console.log(formInfo);
    setFormInfo({ ...formInfo, [inputName]: event.target.value });
  };

  const register = async () => {
    const url =
      'https://fl6lwlunp9.execute-api.eu-west-2.amazonaws.com/dev/signup';
    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify(formInfo)
    });
    console.log(
      '🚀 ~ file: Register.tsx ~ line 35 ~ register ~ response',
      response
    );
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
          onClick={() => register()}
          text={'Register'}
        />
      </div>
    </form>
  );
};

export default Register;
