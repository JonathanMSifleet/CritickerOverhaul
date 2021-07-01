import React, { useState } from 'react';
import classes from './Backdrop.module.scss';

const Backdrop: React.FC = (): JSX.Element | null => {
  const [showBackDrop, setshowBackDrop] = useState(true);

  const hideBackdrop = () => {
    setshowBackDrop(false);
  };

  let toRender;

  showBackDrop
    ? (toRender = <div className={classes.Backdrop} onClick={hideBackdrop} />)
    : (toRender = null);

  return toRender;
};

export default Backdrop;
