import * as endpoints from '../../constants/endpoints';

import { FC, useEffect, useState } from 'react';

import IFilm from '../../../../shared/interfaces/IFilm';
import IRating from '../../../../shared/interfaces/IRating';
import PageView from '../../components/PageView/PageView';
import RateFilm from './RateFilm/RateFilm';
import Spinner from '../../components/Spinner/Spinner';
import classes from './Film.module.scss';
import getColourGradient from '../../utils/getColourGradient';
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
  const [film, setFilm] = useState(null as null | IFilm);
  const [filmPoster, setFilmPoster] = useState(null as string | null);
  const [hasSubmittedRating, setHasSubmittedRating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewAlreadyExists, setReviewAlreadyExists] = useState(false);
  const userState = useRecoilValue(userInfoState);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);

      httpRequest(`${endpoints.GET_FILM_DETAILS}/${id}`, 'GET').then((film) => {
        setFilm(parseFilmPeople(film));
        setIsLoading(false);
      });

      getFilmPoster(id!).then((filmPoster) => setFilmPoster(filmPoster));

      if (userState.loggedIn) {
        setFetchedUserReview(await getUserRating(id!));
        setReviewAlreadyExists(true);
      }
    })();
  }, [id]);

  useEffect(() => {
    const fetchUserReview = async (): Promise<void> => setFetchedUserReview(await getUserRating(id!));

    if (hasSubmittedRating) fetchUserReview();
  }, [hasSubmittedRating]);

  const arrayToString = (input: string): string => {
    let localString = '';
    const parsedInput = JSON.parse(input);

    parsedInput.forEach((person: { name: string }) => (localString += `${person.name}, `));
    return localString.slice(0, -2);
  };

  const deleteReview = async (): Promise<void> => {
    try {
      const result = await httpRequest(
        `${endpoints.DELETE_RATING}/${id}/${userState.username}/${userState.accessToken.accessToken}`,
        'DELETE',
        userState.accessToken
      );

      if (result.statusCode === 401) throw new Error('Invalid access token');
      if (result.statusCode === 500) throw new Error('Error deleting rating');

      setFetchedUserReview(null);
      setHasSubmittedRating(false);
    } catch (error) {
      alert(error);
    }
  };

  const getUserRating = async (id: number): Promise<null | IRating> => {
    const result = await httpRequest(`${endpoints.GET_USER_RATING}/${id}/${userState.username}`, 'GET');

    return result.statusCode === 404 ? null : result;
  };

  const parseFilmPeople = (film: IFilm): IFilm => {
    if (film.directors !== undefined) film.directors = arrayToString(film.directors);
    if (film.writers !== undefined) film.writers = arrayToString(film.writers);
    if (film.actors !== undefined) film.actors = arrayToString(film.actors);

    return film;
  };

  return (
    <PageView>
      <div className={classes.PageWrapper}>
        {!isLoading ? (
          <>
            <div className={classes.FilmDetails}>
              <img className={classes.Poster} src={filmPoster!} />
              <h1 className={classes.FilmTitle}>{film ? film.title : null}</h1>
              {fetchedUserReview ? (
                <>
                  {((): JSX.Element => {
                    let colourGradient;
                    try {
                      colourGradient = getColourGradient(fetchedUserReview.ratingPercentile);
                    } catch (error) {
                      colourGradient = '#000000';
                    }

                    return (
                      <>
                        <p
                          className={classes.RatingValue}
                          // @ts-expect-error
                          style={{ backgroundColor: colourGradient }}
                        >
                          {fetchedUserReview.rating}
                        </p>

                        {fetchedUserReview.ratingPercentile !== undefined ? (
                          // @ts-expect-error
                          <p className={classes.FilmPercentile} style={{ color: colourGradient }}>
                            {fetchedUserReview.ratingPercentile}%
                          </p>
                        ) : null}
                      </>
                    );
                  })()}

                  {fetchedUserReview.review ? <p>Your mini-review: {fetchedUserReview.review}</p> : null}

                  <p>
                    <span className={classes.ModifyReview} onClick={(): void => setFetchedUserReview(null)}>
                      Update Rating
                    </span>
                    {' - '}
                    <span className={classes.ModifyReview} onClick={deleteReview}>
                      Delete Rating
                    </span>
                  </p>

                  <p>
                    <i>
                      Rated on:{' '}
                      {new Date(fetchedUserReview.createdAt!).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </i>
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
