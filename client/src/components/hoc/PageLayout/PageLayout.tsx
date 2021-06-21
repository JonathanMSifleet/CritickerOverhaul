import React from 'react';
import Footer from '../../shared/Footer/Footer';
import classes from './PageView.module.scss';

const PageLayout: React.FC = (): JSX.Element => {
  return (
    <div className={classes.PageLayout}>
      {/* <Header /> */}
      test
      <Footer />
    </div>
  );
};

export default PageLayout;
