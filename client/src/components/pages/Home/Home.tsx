import React from 'react';
import PageView from '../../hoc/PageLayout/PageView/PageView';
import classes from './Home.module.scss';

const Home: React.FC = (): JSX.Element => {
  return (
    <PageView>
      <div className={classes.HomeWrapper}></div>
    </PageView>
  );
};

export default Home;
