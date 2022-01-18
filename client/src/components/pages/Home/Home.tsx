import { useEffect, useState } from 'react';
import { GET_FILM } from '../../../shared/constants/endpoints';
import HTTPRequest from '../../../shared/functions/HTTPRequest';
import IFilm from '../../../shared/interfaces/IFilm';
import PageView from '../../hoc/PageView/PageView';
import FilmCard from './FilmCard/FilmCard';
import classes from './Home.module.scss';

const Home: React.FC = (): JSX.Element => {
  const [films, setFilms] = useState(null as IFilm[] | null);

  useEffect(() => {
    (async (): Promise<void> => {
      setFilms((await HTTPRequest(`${GET_FILM}/home`, 'GET')) as IFilm[]);
    })();
  }, []);

  useEffect(() => {
    const error = new URLSearchParams(document.location.search.substring(1)).get('error');

    if (error) console.error('Invalid Route:', error);
  }, []);

  return (
    <PageView>
      <div className={classes.HomeWrapper}>
        <div className={classes.FilmsContainer}>
          {films ? films.map((film: IFilm) => <FilmCard film={film} key={film.imdb_title_id} />) : null}
        </div>
      </div>
    </PageView>
  );
};

export default Home;
