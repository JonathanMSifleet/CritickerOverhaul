import * as endpoints from '../../constants/endpoints';

import { FC, useEffect, useState } from 'react';

import FilmCard from '../../components/FilmCard/FilmCard';
import httpRequest from '../../utils/httpRequest';
import IFilm from '../../../../shared/interfaces/IFilm';
import PageView from '../../components/PageView/PageView';
import Spinner from '../../components/Spinner/Spinner';

interface IUrlParams {
  path?: string;
}

const Home: FC<IUrlParams> = (): JSX.Element => {
  const [films, setFilms] = useState(null as IFilm[] | null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);

      try {
        const result = await httpRequest(endpoints.GET_FILMS, 'GET');
        if (result.statusCode !== 500) setFilms(result as IFilm[]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const error = new URLSearchParams(document.location.search.substring(1)).get('error');

    if (error) console.error('Invalid Route:', error);
  }, []);

  return (
    <PageView>
      {!isLoading ? (
        <>{films ? films.map((film: IFilm) => <FilmCard film={film} key={film.imdbID} />) : null}</>
      ) : (
        <Spinner />
      )}
    </PageView>
  );
};

export default Home;
