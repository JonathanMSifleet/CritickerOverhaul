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
      <div className="row">
        <div className={`col-md-2 ${classes.Column}`} />
        <div className="col-md-8"> {children} </div>
        <div className={`col-md-2 ${classes.Column}`} />
      </div>
      <Footer />
    </div>
  );
};

export default PageView;
