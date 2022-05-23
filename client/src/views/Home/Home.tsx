import * as endpoints from '../../constants/endpoints';
import { FC } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
import FilmCard from '../../components/FilmCard/FilmCard';
import httpRequest from '../../utils/httpRequest';
import IFilm from '../../../../shared/interfaces/IFilm';
import IUrlParams from '../../interfaces/IUrlParams';
import PageView from '../../hoc/PageView/PageView';
import Spinner from '../../components/Spinner/Spinner';

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
