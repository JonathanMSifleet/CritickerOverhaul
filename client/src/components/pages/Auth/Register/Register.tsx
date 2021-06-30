import React from 'react';
import Button from '../../../shared/Button/Button';
import Input from '../../../shared/Input/Input';
import ThirdPartyLogin from '../ThirdPartyLogin/ThirdPartyLogin';
import classes from './Register.module.scss';

const Register: React.FC = () => {
  return (
    <form>
      <p>Sign up with:</p>

      <ThirdPartyLogin />

      {/* Name input */}
      <div className={`${classes.InputWrapper} form-outline mb-4`}>
        <Input
          type={'text'}
          id={'registerName'}
          className={'form-control'}
          placeholder={'Name'}
        />

        {/* Username input */}
        <Input
          type={'text'}
          id={'registerUsername'}
          className={'form-control'}
          placeholder={'Username'}
        />

        {/* Email input */}
        <Input
          type={'email'}
          id={'registerEmail'}
          className={'form-control'}
          placeholder={'Email'}
        />

        {/* Password input */}
        <Input
          type={'password'}
          id={'registerPassword'}
          className={'form-control'}
          placeholder={'Password'}
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
          text={'Register'}
        />
      </div>
    </form>
  );
};

export default Register;
