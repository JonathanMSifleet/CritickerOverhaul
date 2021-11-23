import React, { useEffect, useState } from 'react';
import { getFilmURL } from '../../../shared/constants/endpoints';
import IFilm from '../../../shared/interfaces/IFilm';
import PageView from '../../hoc/PageLayout/PageView/PageView';
import FilmCard from './FilmCard/FilmCard';
import classes from './Home.module.scss';

const Home: React.FC = (): JSX.Element => {
  const [films, setFilms] = useState(null as unknown as any);

  useEffect(() => {
    async function getFilms() {
      let response: any = await fetch(`${getFilmURL}/home`, {
        method: 'get'
      });
      response = await response.json();

      setFilms(response);
    }
    getFilms();
  }, []);

  useEffect(() => {
    const error = new URLSearchParams(
      document.location.search.substring(1)
    ).get('error');

    if (error) console.error('Invalid Route:', error);
  }, []);

  return (
    <PageView>
      <div className={classes.HomeWrapper}>
        <div className={classes.FilmsContainer}>
          {films
            ? films.map((film: IFilm) => (
                <FilmCard film={film} key={film.imdb_title_id} />
              ))
            : null}
        </div>
      </div>
    </PageView>
  );
};

export default Home;
