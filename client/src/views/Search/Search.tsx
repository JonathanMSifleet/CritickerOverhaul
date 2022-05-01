import * as endpoints from '../../constants/endpoints';
import { FC, useEffect, useState } from 'preact/compat';
import Alert from '../../components/Alert/Alert';
import classes from './Search.module.scss';
import FilmCard from '../../components/FilmCard/FilmCard';
import httpRequest from '../../utils/httpRequest';
import InfiniteScroll from 'react-infinite-scroller';
import ISearchedFilm from '../../../../shared/interfaces/ISearchedFilm';
import PageView from '../../hoc/PageView/PageView';
import Spinner from '../../components/Spinner/Spinner';

interface IUrlParams {
  path?: string;
  searchQuery?: string;
}

const Search: FC<IUrlParams> = ({ searchQuery }) => {
  const [filmResults, setFilmResults] = useState([] as ISearchedFilm[]);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState({} as { [key: string]: string });
  const [statusMessage, setStatusMessage] = useState(null as null | string);

  useEffect(() => {
    setStatusMessage(null);

    (async (): Promise<void> => {
      try {
        const result = await httpRequest(`${endpoints.SEARCH_FOR_FILM}/${searchQuery}`, 'GET');

        setFilmResults(result.films);

        setLastEvaluatedKey(result.LastEvaluatedKey);
      } catch (error) {}
    })();
  }, [searchQuery]);

  useEffect(() => {
    if (lastEvaluatedKey === undefined && filmResults.length === 0) {
      setStatusMessage('No results found');
    } else if (lastEvaluatedKey === undefined) {
      setStatusMessage('No more results found');
    }
  }, [lastEvaluatedKey]);

  const getMoreFilms = async (): Promise<void> => {
    const result = await httpRequest(`${endpoints.SEARCH_FOR_FILM}/${searchQuery}/${lastEvaluatedKey}`, 'GET');

    setLastEvaluatedKey(result.LastEvaluatedKey);

    if (result.films.length !== 0) {
      const tempFilms = filmResults;
      tempFilms.push(...result.films);
      setFilmResults(tempFilms);
    }
  };

  return (
    <PageView>
      <Alert className={classes.Alert} text={'Search is case-sensitive'} type={'warning'} />
      <InfiniteScroll
        pageStart={0}
        loadMore={getMoreFilms}
        hasMore={lastEvaluatedKey !== undefined}
        loader={<Spinner />}
      >
        {filmResults.map((film) => (
          <FilmCard key={film.imdbID} film={film} />
        ))}
      </InfiniteScroll>
      <p>{statusMessage}</p>
    </PageView>
  );
};

export default Search;
