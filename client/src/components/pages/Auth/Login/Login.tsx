import React from 'react';
import classes from './Login.module.scss';

const Login: React.FC = () => {
  return (
    <form>
      <div className="text-center mb-3">
        <p>Sign in with:</p>
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

      <p className="text-center">or:</p>

      {/* Email input */}
      <div className="form-outline mb-4">
        <input
          type="email"
          id="loginName"
          className={`form-control ${classes.EmailInput}`}
          placeholder="Email or username"
        />
      </div>

      {/* Password input */}
      <div className="form-outline mb-4">
        <input
          type="password"
          id="loginPassword"
          className="form-control"
          placeholder="Password"
        />
      </div>

      {/* 2 column grid layout */}
      <div className="row mb-4">
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
      <button type="submit" className="btn btn-primary btn-block mb-4">
        Sign in
      </button>

      {/* Register buttons */}
      <div className="text-center">
        <p>
          Not a member? <a href="#!">Register</a>
        </p>
      </div>
    </form>
  );
};

export default Login;
