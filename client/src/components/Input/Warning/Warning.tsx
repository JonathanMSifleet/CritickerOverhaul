import { FC } from 'preact/compat';
import classes from './Warning.module.scss';

interface IProps {
  text: string;
}

const Warning: FC<IProps> = ({ text }) => (
  <div className={`${classes.Warning} alert alert-danger`}>
    <p className={classes.WarningContent}>{text}</p>
  </div>
);

export default Warning;
