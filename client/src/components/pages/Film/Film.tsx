import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import getIMDbFilmPoster from '../../../functions/getFilmImage';
import PageView from '../../hoc/PageLayout/PageView/PageView';
import classes from './Film.module.scss';

const Film: React.FC = () => {
  const [filmPoster, setFilmPoster] = useState('');
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    async function getFilmPoster() {
      setFilmPoster(await getIMDbFilmPoster(id));
    }
    getFilmPoster();
  }, []);

  return (
    <PageView>
      <div className={classes.PageWrapper}>
        <img className={classes.Poster} src={filmPoster} />
        <h1>Film</h1>
      </div>
    </PageView>
  );
};

export default Film;
