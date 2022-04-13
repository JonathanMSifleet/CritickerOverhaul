import * as endpoints from '../../constants/endpoints';
import { FC, useEffect, useState } from 'preact/compat';
import FilmCard from '../../components/FilmCard/FilmCard';
import httpRequest from '../../utils/httpRequest';
import InfiniteScroll from 'react-infinite-scroller';
import ISearchedFilm from './../../../../shared/interfaces/ISearchedFilm';
import IUrlParams from '../../interfaces/IUrlParams';
import PageView from '../../hoc/PageView/PageView';
import Spinner from '../../components/Spinner/Spinner';

const Search: FC<IUrlParams> = ({ searchQuery }) => {
  const [filmResults, setFilmResults] = useState([] as ISearchedFilm[]);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState({} as { [key: string]: string });

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const result = await httpRequest(`${endpoints.SEARCH_FOR_FILM}/${searchQuery}/2659240`, 'GET');

        if (result.films.length !== 0) {
          const tempFilms = filmResults;
          tempFilms.push(...result.films);
          setFilmResults(tempFilms);
        }

        setLastEvaluatedKey(result.LastEvaluatedKey);
      } catch (error) {}
    })();
  }, [searchQuery]);

  const getMoreFilms = (): void => {
    httpRequest(`${endpoints.SEARCH_FOR_FILM}/${searchQuery}/${lastEvaluatedKey}`, 'GET').then((result) => {
      setLastEvaluatedKey(result.LastEvaluatedKey);

      if (result.films.length !== 0) {
        const tempFilms = filmResults;
        tempFilms.push(...result.films);
        setFilmResults(tempFilms);
      }
    });
  };

  return (
    <PageView>
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
    </PageView>
  );
};

export default Search;
