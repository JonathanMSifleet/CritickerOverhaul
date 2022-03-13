import { FC, useEffect, useState } from 'react';
import IFilm from '../../../../shared/interfaces/IFilm';
import PageView from '../../components/PageView/PageView';
import Spinner from '../../components/Spinner/Spinner';
import * as endpoints from '../../constants/endpoints';
import httpRequest from '../../utils/httpRequest';
import FilmCard from './FilmCard/FilmCard';

interface IUrlParams {
  path?: string;
}

const Home: FC<IUrlParams> = (): JSX.Element => {
  const [films, setFilms] = useState(null as IFilm[] | null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);
      setFilms((await httpRequest(`${endpoints.GET_FILM}/home`, 'GET')) as IFilm[]);
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    const error = new URLSearchParams(document.location.search.substring(1)).get('error');

    if (error) console.error('Invalid Route:', error);
  }, []);

  return (
    <PageView>
      {!isLoading ? (
        <>
          {films
            ? films.map((film: IFilm) => <FilmCard film={film} key={film.imdb_title_id} />)
            : null}
        </>
      ) : (
        <Spinner />
      )}
    </PageView>
  );
};

export default Home;
