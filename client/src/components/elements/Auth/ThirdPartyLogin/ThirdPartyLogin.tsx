import Button from '../../../elements/Button/Button';
import classes from './ThirdPartyLogin.module.scss';

const ThirdPartyLogin: React.FC = () => (
  <div className={`${classes.LoginWrapper} text-center mb-3`}>
    <Button
      className="btn btn-primary btn-floating mx-1"
      text={<i className="fab fa-facebook-f" />}
    />
    <Button className="btn btn-primary btn-floating mx-1" text={<i className="fab fa-google" />} />
    <Button className="btn btn-primary btn-floating mx-1" text={<i className="fab fa-twitter" />} />
    <Button className="btn btn-primary btn-floating mx-1" text={<i className="fab fa-github" />} />
    <p className={`${classes.OrText} text-center`}>or:</p>
  </div>
);

export default ThirdPartyLogin;
