import { FC } from 'preact/compat';
import { useState } from 'preact/hooks';
import Button from '../Button/Button';
import classes from './Auth.module.scss';
import Login from './Login/Login';
import SignUp from './Signup/Signup';

const Auth: FC = () => {
  const [displayLoginForm, setDisplayLoginForm] = useState(true);

  return (
    <div className={classes.FormWrapper}>
      <div className={`btn-group ${classes.AuthButtonGroup}`} role="group" aria-label="Basic example">
        <Button
          className={`${classes.Button} btn btn-primary bg-primary text-white`}
          disabled={displayLoginForm ? true : false}
          onClick={(): void => setDisplayLoginForm(true)}
          text="Login"
        />

        <Button
          className={`${classes.Button} btn btn-primary bg-primary text-white`}
          disabled={displayLoginForm ? false : true}
          onClick={(): void => setDisplayLoginForm(false)}
          text="Register"
        />
      </div>

      {displayLoginForm ? <Login /> : <SignUp />}
    </div>
  );
};

export default Auth;
