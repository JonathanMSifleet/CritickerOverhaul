import React, { useState } from 'react';
import PageView from '../../hoc/PageLayout/PageView/PageView';
import classes from './Auth.module.scss';
import Login from './Login/Login';
import Register from './Register/Register';

const Auth: React.FC = () => {
  const [displayLoginForm, setDisplayLoginForm] = useState(true);

  return (
    <PageView>
      <div className={classes.FormWrapper}>
        <div
          className={`btn-group ${classes.AuthButtonGroup}`}
          role="group"
          aria-label="Basic example"
        >
          <button
            className={`${classes.Button} btn btn-primary bg-primary text-white`}
            disabled={displayLoginForm ? true : false}
            onClick={() => setDisplayLoginForm(true)}
          >
            Login
          </button>
          <button
            className={`${classes.Button} btn btn-primary bg-primary text-white`}
            disabled={displayLoginForm ? false : true}
            onClick={() => setDisplayLoginForm(false)}
          >
            Register
          </button>
        </div>
        {displayLoginForm ? <Login /> : <Register />}
      </div>
    </PageView>
  );
};

export default Auth;
