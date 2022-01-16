import React from 'react';
import Backdrop from '../Backdrop/Backdrop';
import classes from './Modal.module.scss';

interface IProps {
  children: React.ReactNode;
}

const Modal: React.FC<IProps> = ({ children }) => {
  return (
    <>
      <Backdrop />
      <div className={classes.Modal}>{children}</div>
    </>
  );
};

export default Modal;
