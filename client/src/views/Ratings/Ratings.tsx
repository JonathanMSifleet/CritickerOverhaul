import { MDBCol } from 'mdb-react-ui-kit';
import { stringify } from 'query-string';
import { FC, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import PageView from '../../components/PageView/PageView';
import Spinner from '../../components/Spinner/Spinner';
import * as endpoints from '../../constants/endpoints';
import IUrlParams from '../../interfaces/IUrlParams';
import { userInfoState } from '../../store';
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
  const [paginationKeys, setPaginationKeys] = useState([] as any);
  const [ratings, _setRatings] = useState(null as null | IFilm[][]);
  const [_selectedPage, setSelectedPage] = useState(1);
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
        const localNumPages = Math.ceil(numRatings / 60);
        setNumPages(localNumPages);

        const result = await httpRequest(`${endpoints.GET_ALL_RATINGS}/${localUsername}`, 'GET');
        // setRatings(chunk(result.results, Math.ceil(result.results.length / 3)));

        setIsLoadingRatings(false);

        setPaginationKeys(paginationKeys.concat([result.lastEvaluatedKey]));

        await fetchPaginationKeys(localUsername, 1, localNumPages, result.lastEvaluatedKey);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingRatings(false);
      }
    })();
  }, [username]);

  const displayPageNumbers = (): JSX.Element[] => {
    const pageNumberElements = [];

    for (let i = 1; i <= numPages + 1; i++) {
      pageNumberElements.push(
        <p className={classes.PageSelector} onClick={setSelectedPage(i)!}>
          {i}
        </p>
      );
    }

    return pageNumberElements;
  };

  const fetchPaginationKeys = async (
    localUsername: string,
    curPage: number,
    pageNum: number,
    lastEvaluatedKey: any
  ): Promise<any> => {
    const paginationResult = await httpRequest(
      `${endpoints.GET_ALL_RATINGS}/${localUsername}/${stringify(lastEvaluatedKey)}`,
      'GET'
    );

    setPaginationKeys(paginationKeys.concat([paginationResult.lastEvaluatedKey]));

    if (curPage !== pageNum && paginationResult.lastEvaluatedKey !== undefined)
      await fetchPaginationKeys(localUsername, ++curPage, pageNum, paginationResult.lastEvaluatedKey);
  };

  return (
    <PageView>
      {!isLoadingRatings && ratings ? (
        <>
          <div className={`${classes.RatingsWrapper} d-flex align-items-start bg-light mb-2`}>
            <MDBCol md="3">Filter</MDBCol>
            <MDBCol md="9">
              {numPages !== -1 ? <div className={classes.PageSelectorWrappper}>{displayPageNumbers()}</div> : null}

              {/*  <div className={classes.ColumnWrapper}>
                {ratings.map((column: IFilm[], columnIndex: number) => (
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
                ))}
              </div>  */}
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
