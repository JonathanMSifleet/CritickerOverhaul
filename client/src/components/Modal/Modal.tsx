import { FC } from 'react';
import Backdrop from './Backdrop/Backdrop';
import classes from './Modal.module.scss';

interface IProps {
  children: React.ReactNode;
}

const Modal: FC<IProps> = ({ children }) => (
  <>
    <Backdrop />
    <div className={classes.Modal}>{children}</div>
  </>
);

export default Modal;
