import { FC } from 'preact/compat';
import classes from './Alert.module.scss';

interface IProps {
  text: string;
  type: string;
}

const Alert: FC<IProps> = ({ text, type }) => (
  <div className={`${classes.Alert} alert ${type === 'warning' ? 'alert-danger' : 'alert-success'}`}>
    <p className={classes.AlertContent}>{text}</p>
  </div>
);

export default Alert;
