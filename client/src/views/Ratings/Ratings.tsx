import chunk from 'chunk';
import { MDBCol } from 'mdb-react-ui-kit';
import { Link } from 'preact-router/match';
import { stringify } from 'query-string';
import { FC, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import PageView from '../../components/PageView/PageView';
import Spinner from '../../components/Spinner/Spinner';
import * as endpoints from '../../constants/endpoints';
import IUrlParams from '../../interfaces/IUrlParams';
import { userInfoState } from '../../store';
import getCellColour from '../../utils/getCellColour';
import getColourGradient from '../../utils/getColourGradient';
import httpRequest from '../../utils/httpRequest';
import classes from './Ratings.module.scss';

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

const Ratings: FC<IUrlParams> = ({ username }) => {
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);
  const [numPages, setNumPages] = useState(-1);
  const [ratings, setRatings] = useState([] as IFilm[]);
  const [paginationKeys, setPaginationKeys] = useState([] as any);
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

      try {
        const numRatings = await httpRequest(`${endpoints.GET_NUM_RATINGS}/${localUsername}`, 'GET');
        setNumPages(Math.ceil(numRatings / 60));

        const result = await httpRequest(`${endpoints.GET_ALL_RATINGS}/${localUsername}`, 'GET');

        setIsLoadingRatings(false);

        await fetchPaginationKeys(localUsername, result.lastEvaluatedKey, result.results);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingRatings(false);
      }
    })();
  }, [username]);

  const fetchPaginationKeys = async (localUsername: string, lastEvaluatedKey: any, localRatings: any): Promise<any> => {
    const paginationResult = await httpRequest(
      `${endpoints.GET_ALL_RATINGS}/${localUsername}/${stringify(lastEvaluatedKey)}`,
      'GET'
    );

    localRatings = localRatings.concat(paginationResult.results);

    setPaginationKeys(paginationKeys.concat([paginationResult.lastEvaluatedKey]));

    paginationResult.lastEvaluatedKey !== undefined
      ? await fetchPaginationKeys(localUsername, paginationResult.lastEvaluatedKey, localRatings)
      : setRatings(localRatings);
  };

  const paginateArray = (array: any[], selectedPage: number): any[] => {
    const pageSize = 60;

    const startIndex = selectedPage * pageSize;
    const endIndex = startIndex + pageSize;

    return array.slice(startIndex, endIndex);
  };

  return (
    <PageView>
      {!isLoadingRatings && ratings ? (
        <>
          <div className={`${classes.RatingsWrapper} d-flex align-items-start bg-light mb-2`}>
            <MDBCol md="3">Filter</MDBCol>
            <MDBCol md="9">
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

              <div className={classes.ColumnWrapper}>
                {((): JSX.Element[] => {
                  const paginatedRatings = paginateArray(ratings, selectedPage);

                  return chunk(paginatedRatings, Math.ceil(paginatedRatings.length / 3)).map(
                    (column: IFilm[], columnIndex: number) => (
                      <MDBCol className={classes.RatingColumn} key={columnIndex}>
                        {column.map((film: IFilm, cellIndex: number) => {
                          const cellColour = getCellColour(columnIndex, cellIndex);

                          return (
                            <Link
                              className={classes.FilmCell}
                              style={cellColour}
                              href={`/film/${film.imdbID}`}
                              key={film.imdbID}
                            >
                              <span
                                // @ts-expect-error can be used
                                style={{ color: getColourGradient(film.ratingPercentile) }}
                                className={classes.FilmCellRating}
                              >
                                {film.rating}
                              </span>
                              <span className={classes.FilmTitle}>{film.title}</span> ({film.releaseYear})
                            </Link>
                          );
                        })}
                      </MDBCol>
                    )
                  );
                })()}
              </div>
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
