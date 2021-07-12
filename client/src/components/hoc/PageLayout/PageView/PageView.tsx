import React, { ReactNode } from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import classes from './PageView.module.scss';

interface IProps {
  children?: ReactNode;
}

const PageView: React.FC<IProps> = ({ children }): JSX.Element => {
  return (
    <div className={classes.PageViewContainer}>
      <Header />
      <div className={`${classes.Body} row`}>
        <div className={`${classes.Column} col-md-2`} />
        <div className={`${classes.Main} col-md-8`}> {children} </div>
        <div className={`${classes.Column} col-md-2`} />
      </div>
      <Footer />
    </div>
  );
};

export default PageView;
