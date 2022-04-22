import * as endpoints from '../../constants/endpoints';
import { FC, useEffect, useState } from 'react';
import { Link } from 'preact-router/match';
import { MDBCol } from 'mdb-react-ui-kit';
import { stringify } from 'query-string';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../../store';
import chunk from 'chunk';
import classes from './Ratings.module.scss';
import getCellColour from '../../utils/getCellColour';
import getColourGradient from '../../utils/getColourGradient';
import httpRequest from '../../utils/httpRequest';
import PageView from '../../hoc/PageView/PageView';
import Spinner from '../../components/Spinner/Spinner';

interface IFilm {
  countries: string;
  directors: string;
  genres: string;
  imdbID: number;
  languages: string;
  rating: number;
  ratingPercentile: number;
  releaseYear: number;
  title: string;
  writers: string;
}

interface ILastEvaluatedKey {
  imdbID: number;
  rating: number;
  username: string;
}

interface IUrlParams {
  path?: string;
  username?: string;
}

const Ratings: FC<IUrlParams> = ({ username }) => {
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);
  const [numPages, setNumPages] = useState(-1);
  const [ratings, setRatings] = useState([] as IFilm[]);
  const [paginationKeys, setPaginationKeys] = useState([] as ILastEvaluatedKey[]);
  const [selectedPage, setSelectedPage] = useState(0);
  const userState = useRecoilValue(userInfoState);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoadingRatings(true);

      let localUsername;
      if (username) {
        localUsername = username;
      } else if (userState.username !== '') {
        localUsername = userState.username;
      }

      const numRatings = await httpRequest(`${endpoints.GET_NUM_RATINGS}/${localUsername}`, 'GET');
      setNumPages(Math.ceil(numRatings / 60));

      try {
        const ratings = await httpRequest(`${endpoints.GET_ALL_RATINGS}/${localUsername}`, 'GET');
        setRatings(ratings.results);
        setIsLoadingRatings(false);

        fetchPaginationKeys(localUsername, ratings.lastEvaluatedKey, ratings.results);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingRatings(false);
      }
    })();
  }, [username]);

  const fetchPaginationKeys = async (
    localUsername: string,
    lastEvaluatedKey: ILastEvaluatedKey,
    localRatings: IFilm[]
  ): Promise<void> => {
    const paginationResult = await httpRequest(
      `${endpoints.GET_ALL_RATINGS}/${localUsername}/${stringify(lastEvaluatedKey)}`,
      'GET'
    );

    localRatings = localRatings.concat(paginationResult.results);

    setPaginationKeys(paginationKeys.concat([paginationResult.lastEvaluatedKey]));

    if (paginationResult.lastEvaluatedKey !== undefined) {
      await fetchPaginationKeys(localUsername, paginationResult.lastEvaluatedKey, localRatings);
    } else {
      setRatings(localRatings);
    }
  };

  const paginateArray = (array: IFilm[], selectedPage: number): IFilm[] => {
    const pageSize = 60;

    const startIndex = selectedPage * pageSize;
    const endIndex = startIndex + pageSize;

    return array.slice(startIndex, endIndex);
  };

  const renderRatings = (): JSX.Element[] => {
    const paginatedRatings = paginateArray(ratings, selectedPage);

    return chunk(paginatedRatings, Math.ceil(paginatedRatings.length / 3)).map(
      (column: IFilm[], columnIndex: number) => (
        <MDBCol className={classes.RatingColumn} key={columnIndex}>
          {column.map((film: IFilm, cellIndex: number) => (
            <Link
              className={classes.FilmCell}
              style={getCellColour(columnIndex, cellIndex)}
              href={`/film/${film.imdbID}`}
              key={film.imdbID}
            >
              <span style={{ color: getColourGradient(film.ratingPercentile) }} className={classes.FilmCellRating}>
                {film.rating}
              </span>
              <span className={classes.FilmTitle}>{film.title}</span> ({film.releaseYear})
            </Link>
          ))}
        </MDBCol>
      )
    );
  };

  return (
    <PageView>
      {!isLoadingRatings && ratings ? (
        <>
          <div className={`${classes.RatingsWrapper} d-flex align-items-start bg-light mb-2`}>
            <MDBCol md="12">
              <div className={classes.PageSelectorsWrapper}>
                {Array.from({ length: numPages }, (_, i) => i++).map((pageNumber) => (
                  <div
                    className={classes.PageSelectorWrapper}
                    onClick={(): void => setSelectedPage(pageNumber)}
                    key={pageNumber}
                  >
                    <p className={pageNumber !== selectedPage ? classes.PageSelector : classes.DisabledPageSelector}>
                      {pageNumber + 1}
                    </p>
                  </div>
                ))}
              </div>

              <div className={classes.ColumnWrapper}>{((): JSX.Element[] => renderRatings())()}</div>
            </MDBCol>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </PageView>
  );
};

export default Ratings;
