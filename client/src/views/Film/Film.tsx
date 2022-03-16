import * as endpoints from '../../constants/endpoints';

import { FC, useEffect, useState } from 'react';

import IRating from '../../../../shared/interfaces/IRating';
import PageView from '../../components/PageView/PageView';
import RateFilm from './RateFilm/RateFilm';
import Spinner from '../../components/Spinner/Spinner';
import classes from './Film.module.scss';
import getFilmPoster from '../../utils/getFilmPoster';
import httpRequest from '../../utils/httpRequest';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../../store';

interface IUrlParams {
  path?: string;
  id?: number;
}

const Film: FC<IUrlParams> = ({ id }) => {
  const [fetchedUserReview, setFetchedUserReview] = useState(null as null | IRating);
  // to do
  const [film, setFilm] = useState(null as any);
  const [filmPoster, setFilmPoster] = useState(null as string | null);
  const [hasSubmittedRating, setHasSubmittedRating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewAlreadyExists, setReviewAlreadyExists] = useState(false);
  const userState = useRecoilValue(userInfoState);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);

      try {
        const [film, filmPoster] = [
          await httpRequest(`${endpoints.GET_FILM_BY_PARAM}/${id}`, 'GET'),
          await getFilmPoster(id!)
        ];

        if (userState.loggedIn) {
          setFetchedUserReview(await getUserRating(id!, userState.UID));
          setReviewAlreadyExists(true);
        }

        setFilm(film);
        setFilmPoster(filmPoster);
      } catch (error) {
        if (error instanceof Error) console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    const fetchUserReview = async (): Promise<void> => setFetchedUserReview(await getUserRating(id!, userState.UID));

    if (hasSubmittedRating) fetchUserReview();
  }, [hasSubmittedRating]);

  const deleteReview = async (): Promise<void> => {
    try {
      await httpRequest(`${endpoints.DELETE_REVIEW}/${id}/${userState.UID}`, 'DELETE');

      setFetchedUserReview(null);
      setHasSubmittedRating(false);
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  };

  const getUserRating = async (id: number, userID: string): Promise<null | IRating> => {
    const result = await httpRequest(`${endpoints.GET_USER_RATING}/${id}/${userID}`, 'GET');

    return result.statusCode === 404 ? null : result;
  };

  return (
    <PageView>
      <div className={classes.PageWrapper}>
        {!isLoading ? (
          <>
            <div className={classes.FilmDetails}>
              <img className={classes.Poster} src={filmPoster!} />
              <h1>{film ? film.title : null}</h1>
              {fetchedUserReview ? (
                <>
                  <p>Your Score {fetchedUserReview.rating}</p>
                  <p>Your mini-review: {fetchedUserReview.review}</p>
                  <p>
                    Rated on:{' '}
                    {new Date(fetchedUserReview.createdAt!).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p>
                    <span className={classes.ModifyReview} onClick={(): void => setFetchedUserReview(null)}>
                      Update Rating
                    </span>
                    {' - '}
                    <span className={classes.ModifyReview} onClick={deleteReview}>
                      Delete Rating
                    </span>
                  </p>
                </>
              ) : !hasSubmittedRating && userState.loggedIn ? (
                <RateFilm
                  filmID={id!}
                  reviewAlreadyExists={reviewAlreadyExists}
                  setHasSubmittedRating={(hasSubmittedRating: boolean): void => {
                    setHasSubmittedRating(hasSubmittedRating);
                  }}
                  userState={userState}
                />
              ) : null}
              <p className={classes.FilmDescription}>{film ? film.description : null}</p>

              <div className={classes.FilmInfo}>
                <h4>Cast and information</h4>
                <p>Directed by: {film ? film.directors : 'Unknown'}</p>
                <p>Written by: {film ? film.writers : 'Unknown'} </p>
                <p>Starring: {film ? film.actors : 'Unknown'}</p>
                <p>Genre(s): {film ? film.genres : 'Unknown'}</p>
                <p>Language(s): {film ? film.languages : 'Unknown'}</p>
                <p>Country(s): {film ? film.countries : 'Unknown'}</p>
              </div>
            </div>
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </PageView>
  );
};

export default Film;
