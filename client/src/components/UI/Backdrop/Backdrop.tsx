import React from 'react';
import classes from './Backdrop.module.scss';

interface IProps {
  clicked?(): void;
  show: boolean;
}

const backdrop: React.FC<IProps> = ({ clicked, show }): JSX.Element | null =>
  show ? <div className={classes.Backdrop} onClick={clicked}></div> : null;

export default backdrop;
