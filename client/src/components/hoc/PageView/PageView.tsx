import React, { ReactNode } from 'react';
import AdvertSection from '../../shared/AdvertSection/AdvertSection';
import Footer from '../../shared/Footer/Footer';
import Header from '../../shared/Header/Header';
import classes from './PageView.module.scss';

interface IProps {
  children?: ReactNode;
}

const PageView: React.FC<IProps> = ({ children }): JSX.Element => {
  return (
    <div className={classes.PageViewContainer}>
      <Header />
      <AdvertSection direction={'left'} />
      <AdvertSection direction={'right'} />
      {children}
      <Footer />
    </div>
  );
};

export default PageView;
