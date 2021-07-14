import React, { useState } from 'react';
import Button from '../../../shared/Button/Button';
import classes from './Auth.module.scss';
import Login from './Login/Login';
import Register from './Register/Register';

const Auth: React.FC = () => {
  const [displayLoginForm, setDisplayLoginForm] = useState(true);

  return (
    <div className={classes.FormWrapper}>
      <div
        className={`btn-group ${classes.AuthButtonGroup}`}
        role="group"
        aria-label="Basic example"
      >
        <Button
          className={`${classes.Button} btn btn-primary bg-primary text-white`}
          disabled={displayLoginForm ? true : false}
          onClick={() => setDisplayLoginForm(true)}
          text="Login"
        />

        <Button
          className={`${classes.Button} btn btn-primary bg-primary text-white`}
          disabled={displayLoginForm ? false : true}
          onClick={() => setDisplayLoginForm(false)}
          text="Register"
        />
      </div>
      <p className={classes.InstructionText}>
        {displayLoginForm ? 'Log in' : 'Register'} with:
      </p>

      {displayLoginForm ? <Login /> : <Register />}
    </div>
  );
};

export default Auth;