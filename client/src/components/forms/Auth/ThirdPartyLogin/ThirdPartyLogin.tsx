import React from 'react';
import Button from '../../../../elements/Button/Button';
import classes from './ThirdPartyLogin.module.scss';

const ThirdPartyLogin: React.FC = () => {
  return (
    <div className={`${classes.LoginWrapper} text-center mb-3`}>
      <Button className="btn btn-primary btn-floating mx-1" text={<i className="fab fa-facebook-f"></i>} />
      <Button className="btn btn-primary btn-floating mx-1" text={<i className="fab fa-google"></i>} />
      <Button className="btn btn-primary btn-floating mx-1" text={<i className="fab fa-twitter"></i>} />
      <Button className="btn btn-primary btn-floating mx-1" text={<i className="fab fa-github"></i>} />
      <p className={`${classes.OrText} text-center`}>or:</p>
    </div>
  );
};

export default ThirdPartyLogin;
