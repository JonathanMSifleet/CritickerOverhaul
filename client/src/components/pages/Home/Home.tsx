import React, { useEffect } from 'react';
import PageView from '../../hoc/PageLayout/PageView/PageView';
import classes from './Home.module.scss';

const Home: React.FC = (): JSX.Element => {
  useEffect(() => {
    const error = new URLSearchParams(
      document.location.search.substring(1)
    ).get('error');

    if (error) console.error('Invalid Route:', error);
  }, []);

  return (
    <PageView>
      <div className={classes.HomeWrapper}></div>
    </PageView>
  );
};

export default Home;
