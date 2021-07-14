import React, { useEffect } from 'react';
import PageView from '../../hoc/PageLayout/PageView/PageView';
import classes from './Home.module.scss';
import queryString from 'query-string';

const Home: React.FC = (): JSX.Element => {
  useEffect(() => {
    const error = queryString.parse(location.search).error;
    if (error) {
      console.error('Invalid Route:', error);
    }
  }, []);

  return (
    <PageView>
      <div className={classes.HomeWrapper}></div>
    </PageView>
  );
};

export default Home;
