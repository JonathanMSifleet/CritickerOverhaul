import React from 'react';
import Button from '../../../shared/Button/Button';
import Input from '../../../shared/Input/Input';
import ThirdPartyLogin from '../ThirdPartyLogin/ThirdPartyLogin';
import classes from './Login.module.scss';

const Login: React.FC = () => {
  return (
    <form>

      <ThirdPartyLogin />

      {/* Email input */}
      <div className={`${classes.InputWrapper} form-outline mb-4`}>
        <Input
          type={'email'}
          id={'loginName'}
          className={'form-control'}
          placeholder={'Email or username'}
        />
        <Input
          type={'password'}
          id={'loginPassword'}
          className={'form-control'}
          placeholder={'Password'}
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
                id="loginCheck"
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
          text={'Sign in'}
        />
      </div>
    </form>
  );
};

export default Login;
