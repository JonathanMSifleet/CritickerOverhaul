import { FC } from 'preact/compat';
import classes from './Alert.module.scss';

interface IProps {
  className?: string;
  text: string;
  type: string;
}

const Alert: FC<IProps> = ({ className, text, type }) => (
  <div className={`${classes.Alert} ${className} alert ${type === 'warning' ? 'alert-danger' : 'alert-success'}`}>
    <p className={classes.AlertContent}>{text}</p>
  </div>
);

export default Alert;
