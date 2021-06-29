import React, { useContext, useEffect, useState } from 'react';
import Context from '../../../hooks/store/context';
import PageView from '../../hoc/PageView/PageView';
import classes from './Auth.module.scss';
import Login from './Login/Login';
import Register from './Register/Register';

const Auth: React.FC = () => {
  const { globalState, actions } = useContext(Context);
  const [displayLoginForm, setDisplayLoginForm] = useState(true);

  useEffect(() => {
    console.log(globalState);
    if (globalState.authFormState === 'register') {
      setDisplayLoginForm(false);
    }
  }, []);

  return (
    <PageView>
      <div className={classes.FormWrapper}>
        <button
          className="nav-link active"
          disabled={displayLoginForm ? true : false}
          onClick={() => setDisplayLoginForm(true)}
        >
          Login
        </button>
        <button
          className="nav-link active"
          disabled={displayLoginForm ? false : true}
          onClick={() => setDisplayLoginForm(false)}
        >
          Register
        </button>
        {displayLoginForm ? <Login /> : <Register />}
      </div>
    </PageView>
  );
};

export default Auth;
