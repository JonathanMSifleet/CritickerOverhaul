import React from 'react';

const Register: React.FC = () => {
  return (
    <form>
      <div className="text-center mb-3">
        <p>Sign up with:</p>
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

      {/* Name input */}
      <div className="form-outline mb-4">
        <input
          type="text"
          id="registerName"
          className="form-control"
          placeholder="Name"
        />
      </div>

      {/* Username input */}
      <div className="form-outline mb-4">
        <input
          type="text"
          id="registerUsername"
          className="form-control"
          placeholder="Username"
        />
      </div>

      {/* Email input */}
      <div className="form-outline mb-4">
        <input
          type="email"
          id="registerEmail"
          className="form-control"
          placeholder="Email"
        />
      </div>

      {/* Password input */}
      <div className="form-outline mb-4">
        <input
          type="password"
          id="registerPassword"
          className="form-control"
          placeholder="Password"
        />
      </div>

      {/* Repeat Password input */}
      <div className="form-outline mb-4">
        <input
          type="password"
          id="registerRepeatPassword"
          className="form-control"
          placeholder="Repeat password"
        />
      </div>

      {/* Checkbox */}
      <div className="form-check d-flex justify-content-center mb-4">
        <input
          className="form-check-input me-2"
          type="checkbox"
          value=""
          id="registerCheck"
          checked
          aria-describedby="registerCheckHelpText"
        />
        <label className="form-check-label" htmlFor="registerCheck">
          I have read and agree to the terms
        </label>
      </div>

      {/* Submit button */}
      <button type="submit" className="btn btn-primary btn-block mb-3">
        Sign in
      </button>
    </form>
  );
};

export default Register;
