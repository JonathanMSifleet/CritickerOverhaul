import { FC, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import PageView from '../../components/PageView/PageView';
import Spinner from '../../components/Spinner/Spinner';
import * as endpoints from '../../constants/endpoints';
import IUserReview from '../../interfaces/IUserReview';
import { userInfoState } from '../../store';
import getFilmPoster from '../../utils/getFilmPoster';
import httpRequest from '../../utils/httpRequest';
import classes from './Film.module.scss';
import RateFilm from './RateFilm/RateFilm';

interface IUrlParams {
  path?: string;
  id?: number;
}

const Film: FC<IUrlParams> = ({ id }) => {
  // to do
  const [film, setFilm] = useState(null as any);
  const [filmPoster, setFilmPoster] = useState(null as string | null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedUserReview, setFetchedUserReview] = useState(null as null | IUserReview);
  const userState = useRecoilValue(userInfoState);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);

      try {
        const [film, filmPoster, userReview] = [
          await httpRequest(`${endpoints.GET_FILM_BY_PARAM}/${id}`, 'GET'),
          await getFilmPoster(id!),
          await getUserRating(id!, userState.UID)
        ];

        setFilm(film);
        setFilmPoster(filmPoster);
        setFetchedUserReview(userReview!);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  const deleteReview = async (): Promise<void> => {
    try {
      const result = await httpRequest(
        `${endpoints.DELETE_REVIEW}/${id}/${userState.UID}`,
        'DELETE'
      );
      console.log('🚀 ~ file: Film.tsx ~ line 53 ~ deleteReview ~ result', result);

      setFetchedUserReview(null);
    } catch (error) {}
  };

  const getUserRating = async (id: number, userID: string): Promise<void> =>
    await httpRequest(`${endpoints.GET_USER_RATING}/${id}/${userID}`, 'GET');

  return (
    <PageView>
      <div className={classes.PageWrapper}>
        {!isLoading ? (
          <>
            <div className={classes.FilmDetails}>
              <img className={classes.Poster} src={filmPoster!} />
              <h1 color="primary">{film ? film.title : null}</h1>
              {fetchedUserReview ? (
                <>
                  <p>Your Score {fetchedUserReview!.rating}</p>
                  <p>Your mini-review: {fetchedUserReview!.reviewText}</p>
                  <p onClick={deleteReview}>Delete Rating</p>
                </>
              ) : (
                <RateFilm filmID={id!} userState={userState} />
              )}
              <p>{film ? film.description : null}</p>

              <h2>Cast and information</h2>
              <p>Directed by: {film ? film.directors : 'Unknown'}</p>
              <p>Written by: {film ? film.writers : 'Unknown'} </p>
              <p>Starring: {film ? film.actors : 'Unknown'}</p>
              <p>Genre(s): {film ? film.genres : 'Unknown'}</p>
              <p>Language(s): {film ? film.languages : 'Unknown'}</p>
              <p>Country(s): {film ? film.countries : 'Unknown'}</p>
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
