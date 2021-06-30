import React from 'react';
import classes from './Login.module.scss';

const Login: React.FC = () => {
  return (
    <form>
      <div className={`${classes.LoginWrapper} text-center mb-3`}>
        <p>Log in with:</p>
        <button type="button" className="btn btn-primary btn-floating mx-1">
          <i className="fab fa-facebook-f"></i>
        </button>

        <button type="button" className="btn btn-primary btn-floating mx-1">
          <i className="fab fa-google"></i>
        </button>

        <button type="button" className="btn btn-primary btn-floating mx-1">
          <i className="fab fa-twitter"></i>
        </button>

        <button type="button" className="btn btn-primary btn-floating mx-1">
          <i className="fab fa-github"></i>
        </button>
      </div>

      <p className={`${classes.OrText} text-center`}>or:</p>

      {/* Email input */}
      <div className={`${classes.InputWrapper} form-outline mb-4`}>
        <input
          type="email"
          id="loginName"
          className={`form-control ${classes.FormInput}`}
          placeholder="Email or username"
        />
        <input
          type="password"
          id="loginPassword"
          className={`form-control ${classes.FormInput}`}
          placeholder="Password"
        />
      </div>

      {/* 2 column grid layout */}
      <div className={`${classes.PasswordOptions} row mb-4`}>
        <div className="col-md-6 d-flex justify-content-center">
          {/* Checkbox */}
          <div className="form-check mb-3 mb-md-0">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="loginCheck"
              checked
            />
            <label className="form-check-label" htmlFor="loginCheck">
              {' '}
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
      <div className={classes.LoginButtonWrapper}>
        <button
          type="submit"
          className={`${classes.LoginButton} btn btn-primary btn-block mb-4`}
        >
          Sign in
        </button>
      </div>
    </form>
  );
};

export default Login;
