import React, { useState } from 'react';
import classes from './Backdrop.module.scss';

interface IProps {
  children: any;
}

const Backdrop: React.FC<IProps> = ({ children }): JSX.Element | null => {
  const [showBackDrop, setshowBackDrop] = useState(true);

  const hideBackdrop = () => {
    setshowBackDrop(false);
  };

  let toRender;

  if (showBackDrop) {
    toRender = (
      <div className={classes.Backdrop} onClick={hideBackdrop}>
        {children}
      </div>
    );
  } else {
    toRender = null;
  }

  return toRender;
};

export default Backdrop;
