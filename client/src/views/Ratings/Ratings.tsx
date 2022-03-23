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

interface IAttributeValue {
  [key: string]: string | number;
}

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState({
    imdbID: 79470,
    rating: 6,
    username: 'jonathanmsifleet'
  } as IAttributeValue);

  const [ratings, setRatings] = useState(null as null | IFilm[][]);
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
        const result =
          lastEvaluatedKey === undefined
            ? await httpRequest(`${endpoints.GET_ALL_RATINGS}/${localUsername}`, 'GET')
            : await httpRequest(`${endpoints.GET_ALL_RATINGS}/${localUsername}/${stringify(lastEvaluatedKey)}`, 'GET');

        console.log('🚀 ~ file: Ratings.tsx ~ line 37 ~ result', result);

        setLastEvaluatedKey(result.lastEvaluatedKey);
        setRatings(chunk(result.results, Math.ceil(result.results.length / 3)));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingRatings(false);
      }
    })();
  }, [username]);

  return (
    <PageView>
      {!isLoadingRatings && ratings ? (
        <>
          <div className={`${classes.RatingsWrapper} d-flex align-items-start bg-light mb-2`}>
            <MDBCol md="3">Filter</MDBCol>
            <MDBCol md="9">
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