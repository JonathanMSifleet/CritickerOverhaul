import { FC } from 'react';
import Backdrop from './Backdrop/Backdrop';
import classes from './Modal.module.scss';

interface IProps {
  authState: any;
  children: React.ReactNode;
}

const Modal: FC<IProps> = ({ authState, children }) => (
  <>
    <Backdrop authState={authState} />
    <div className={classes.Modal}>{children}</div>
  </>
);

export default Modal;
