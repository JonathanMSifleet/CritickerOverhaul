import React, { useState } from 'react';
import PageView from '../../hoc/PageView/PageView';
import classes from './Auth.module.scss';
import Login from './Login/Login';
import Register from './Register/Register';

const Auth: React.FC = () => {
  const [login, setLogin] = useState(true);

  return (
    <PageView>
      <div className={classes.FormWrapper}>
        <button
          className="nav-link active"
          disabled={login ? true : false}
          onClick={() => setLogin(true)}
        >
          Login
        </button>
        <button
          className="nav-link active"
          disabled={login ? false : true}
          onClick={() => setLogin(false)}
        >
          Register
        </button>
        {login ? <Login /> : <Register />}
      </div>
    </PageView>
  );
};

export default Auth;
