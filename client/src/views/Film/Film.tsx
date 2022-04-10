import * as endpoints from '../../constants/endpoints';

import { FC, useEffect, useState } from 'react';

import { Link } from 'preact-router/match';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../../store';
import classes from './Film.module.scss';
import getColourGradient from '../../utils/getColourGradient';
import getFilmPoster from '../../utils/getFilmPoster';
import httpRequest from '../../utils/httpRequest';
import IFilm from '../../../../shared/interfaces/IFilm';
import PageView from '../../components/PageView/PageView';
import RateFilm from './RateFilm/RateFilm';
import Spinner from '../../components/Spinner/Spinner';
import UserAvatar from './UserAvatar/UserAvatar';

interface IRating {
  createdAt: number;
  rating: number;
  ratingPercentile: number;
  review?: string;
  username: string;
}

interface IUrlParams {
  path?: string;
  id?: number;
}

const Film: FC<IUrlParams> = ({ id }) => {
  const [colourGradient, setColourGradient] = useState('');
  const [fetchedUserReview, setFetchedUserReview] = useState(null as null | IRating);
  const [film, setFilm] = useState(null as null | IFilm);
  const [filmPoster, setFilmPoster] = useState(null as string | null);
  const [hasSubmittedRating, setHasSubmittedRating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewAlreadyExists, setReviewAlreadyExists] = useState(false);
  const [ratings, setRatings] = useState([] as IRating[]);
  const userState = useRecoilValue(userInfoState);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);

      httpRequest(`${endpoints.GET_FILM_DETAILS}/${id}`, 'GET').then((film) => {
        setFilm(parseFilmPeople(film));
        setIsLoading(false);
      });

      getFilmPoster(id!).then((filmPoster) => setFilmPoster(filmPoster));

      httpRequest(`${endpoints.GET_FILM_RATINGS}/${id}`, 'GET').then((ratings) => {
        if (ratings.statusCode === 404) return;
        setRatings(ratings);
      });

      if (!userState.loggedIn) return;

      getUserRating(id!).then((userRating) => {
        setFetchedUserReview(userRating);
        setColourGradient(determineColourGradient(userRating!.ratingPercentile!));
        setReviewAlreadyExists(true);
      });
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
      setReviewAlreadyExists(false);
    } catch (error) {
      alert(error);
    }
  };

  const determineColourGradient = (ratingPercentile: number): string =>
    ratingPercentile !== undefined ? getColourGradient(ratingPercentile) : '#ffffff';

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
    <PageView backgroundCSS={classes.PageWrapper}>
      {!isLoading ? (
        <>
          <div className={classes.FilmDetails}>
            <img className={classes.Poster} src={filmPoster!} />
            <h1 className={classes.FilmTitle}>
              {film ? film.title : null}
              <span className={classes.FilmYear}>{film ? `${film.releaseYear}` : null}</span>
            </h1>

            {fetchedUserReview ? (
              <>
                <p className={classes.RatingValue} style={{ backgroundColor: colourGradient }}>
                  {fetchedUserReview.rating}
                </p>

                {fetchedUserReview.ratingPercentile !== undefined ? (
                  <p className={classes.FilmPercentile} style={{ color: colourGradient }}>
                    {fetchedUserReview.ratingPercentile}
                    {fetchedUserReview.ratingPercentile ? '%' : null}
                  </p>
                ) : null}

                {fetchedUserReview.review ? <p>{fetchedUserReview.review}</p> : null}

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

          <div className={classes.FilmRatingsWrapper}>
            <h3>Ratings:</h3>
            <div className={classes.FilmRatings}>
              {ratings.length !== 0 ? (
                ratings.map((rating: IRating) => (
                  <div className={classes.UserRatingWrapper} key={rating.username}>
                    <UserAvatar username={rating.username} />

                    <p className={classes.UserRating}>
                      <Link href={`#profile/${rating.username}`}>{rating.username}</Link>
                    </p>
                    <p
                      className={classes.UserRatingScore}
                      style={{ color: determineColourGradient(rating.ratingPercentile) }}
                    >
                      {rating.rating}
                      <span className={classes.UserRatingPercentile}>{rating.ratingPercentile}%</span>
                    </p>
                    <div className={classes.UserReviewTextWrapper}>
                      {rating.review ? <p className={classes.UserReviewText}>{rating.review}</p> : null}
                    </div>
                  </div>
                ))
              ) : (
                <p>No ratings found</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </PageView>
  );
};

export default Film;
