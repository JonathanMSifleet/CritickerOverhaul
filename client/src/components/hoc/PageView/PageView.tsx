import React, { ReactNode } from 'react';
import Header from '../../shared/Header/Header';
import classes from './PageView.module.scss';

interface IProps {
  children?: ReactNode;
}

const PageView: React.FC<IProps> = ({ children }): JSX.Element => {
  return (
    <div className={classes.PageView}>
      <Header />
      {children}
    </div>
  );
};

export default PageView;
