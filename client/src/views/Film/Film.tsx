import * as endpoints from '../../constants/endpoints';
import { FC, useEffect, useState } from 'react';
import { Link } from 'preact-router/match';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../../store';
import classes from './Film.module.scss';
import ColouredText from '../../components/ColouredText/ColouredText';
import epochToDate from '../../utils/epochToDate';
import FilmPoster from '../../components/FilmPoster/FilmPoster';
import getColourGradient from '../../utils/getColourGradient';
import getUserRating from '../../utils/getUserRating';
import httpRequest from '../../utils/httpRequest';
import IFilm from '../../../../shared/interfaces/IFilm';
import PageView from '../../hoc/PageView/PageView';
import RateFilm from '../../components/RateFilm/RateFilm';
import RatingOptions from '../../components/RatingOptions/RatingOptions';
import Spinner from '../../components/Spinner/Spinner';
import Toggle from '../../components/Toggle/Toggle';
import UserAvatar from './UserAvatar/UserAvatar';

interface IRating {
  createdAt: number;
  rating: number;
  ratingPercentile: number;
  review?: string;
  TCI?: string | number;
  username: string;
}

interface IUrlParams {
  path?: string;
  imdbID?: number;
}

const Film: FC<IUrlParams> = ({ imdbID }) => {
  const [colourGradient, setColourGradient] = useState('');
  const [fetchedUserReview, setFetchedUserReview] = useState(null as null | IRating);
  const [film, setFilm] = useState(null as null | IFilm);
  const [hasSubmittedRating, setHasSubmittedRating] = useState(false);
  const [isDeletingReview, setIsDeletingReview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);
  const [ratings, setRatings] = useState([] as IRating[]);
  const [reviewAlreadyExists, setReviewAlreadyExists] = useState(false);
  const [sortByTCI, setSortByTCI] = useState(false);
  const [originalRatings, setOriginalRatings] = useState([] as IRating[]);
  const userState = useRecoilValue(userInfoState);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);

      httpRequest(`${endpoints.GET_FILM_DETAILS}/${imdbID}`, 'GET').then((film) => {
        setFilm(parseFilmPeople(film));
        setIsLoading(false);
      });

      setIsLoadingRatings(true);
      httpRequest(`${endpoints.GET_FILM_RATINGS}/${imdbID}`, 'GET').then((ratings) => {
        if (ratings.statusCode === 404) return;

        const filteredRatings = ratings.filter((rating: IRating) => rating.username !== userState.username);

        setRatings(filteredRatings);
        setOriginalRatings(filteredRatings);
        setIsLoadingRatings(false);
      });

      if (!userState.loggedIn) return;

      const userRating = await getUserRating(userState.username, imdbID!);

      if (userRating) {
        setFetchedUserReview(userRating as IRating);
        setColourGradient(determineColourGradient(userRating!.ratingPercentile!));
        setReviewAlreadyExists(true);
      }
    })();
  }, [imdbID]);

  useEffect(() => {
    if (!sortByTCI) {
      setRatings(originalRatings);
      return;
    }

    let tempRatings = ratings;
    tempRatings = tempRatings.map((rating) => ({ ...rating, TCI: getTCI(rating.username) }));

    tempRatings.sort((a, b) => {
      if (a.TCI === 'N/A') return 1;
      if (b.TCI === 'N/A') return -1;

      // @ts-expect-error works as intended
      return a.TCI - b.TCI;
    });

    setRatings(tempRatings);
  }, [sortByTCI]);

  useEffect(() => {
    if (hasSubmittedRating)
      (async (): Promise<void> => {
        const userRating = await getUserRating(userState.username, imdbID!);
        setFetchedUserReview(userRating as IRating);
        setColourGradient(determineColourGradient(userRating!.ratingPercentile!));
      })();
  }, [hasSubmittedRating]);

  const arrayToString = (input: string): string => {
    let localString = '';
    const parsedInput = JSON.parse(input);

    parsedInput.forEach((person: { name: string }) => (localString += `${person.name}, `));
    return localString.slice(0, -2);
  };

  const determineColourGradient = (ratingPercentile: number): string =>
    ratingPercentile !== undefined ? getColourGradient(ratingPercentile) : '#ffffff';

  const getTCI = (username: string): number | string | undefined => {
    if (username === userState.username) return;

    const TCI = userState.TCIs.find((TCI: { username: string }) => TCI.username === username);
    return TCI === undefined ? 'N/A' : TCI.TCI;
  };

  const handleToggle = (event: { target: { checked: boolean } }): void => setSortByTCI(event.target.checked);

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
            <FilmPoster className={classes.Poster} imdbID={imdbID!} />
            <h1 className={classes.FilmTitle}>
              {film ? film.title : null}
              <span className={classes.FilmYear}>{film ? `${film.releaseYear}` : null}</span>
            </h1>

            {fetchedUserReview ? (
              <>
                <p className={classes.FilmRating}>
                  <ColouredText colourGradient={colourGradient} text={fetchedUserReview.rating!} />
                  {fetchedUserReview.ratingPercentile !== undefined ? (
                    <span className={classes.FilmPercentile} style={{ color: colourGradient }}>
                      {fetchedUserReview.ratingPercentile}
                      {fetchedUserReview.ratingPercentile ? '%' : null}
                    </span>
                  ) : null}
                </p>

                {fetchedUserReview.review ? <p>{fetchedUserReview.review}</p> : null}

                {!isDeletingReview ? (
                  <RatingOptions
                    imdbID={imdbID!}
                    setFetchedUserReview={(fetchedUserReview): void =>
                      setFetchedUserReview(fetchedUserReview as IRating)
                    }
                    setHasSubmittedRating={(hasSubmittedRating): void => setHasSubmittedRating(hasSubmittedRating)}
                    setIsDeletingReview={(isDeletingReview): void => setIsDeletingReview(isDeletingReview)}
                    setReviewAlreadyExists={(reviewAlreadyExists: boolean): void =>
                      setReviewAlreadyExists(reviewAlreadyExists)
                    }
                    userState={userState}
                  />
                ) : (
                  <Spinner />
                )}

                <p>
                  <i>
                    Rated on:{' '}
                    {epochToDate(fetchedUserReview.createdAt!, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </i>
                </p>
              </>
            ) : !hasSubmittedRating && userState.loggedIn ? (
              <RateFilm
                filmID={imdbID!}
                reviewAlreadyExists={reviewAlreadyExists}
                setHasSubmittedRating={(hasSubmittedRating: boolean): void => {
                  setHasSubmittedRating(hasSubmittedRating);
                }}
              />
            ) : null}

            <p className={classes.FilmDescription}>{film ? film.description : null}</p>

            <div className={classes.FilmInfo}>
              <h4 className={classes.InfoHeader}>Cast and information</h4>
              <p>Directed by: {film ? film.directors : 'Unknown'}</p>
              <p>Written by: {film ? film.writers : 'Unknown'} </p>
              <p>Starring: {film ? film.actors : 'Unknown'}</p>
              <p>Genre(s): {film ? film.genres : 'Unknown'}</p>
              <p>Language(s): {film ? film.languages : 'Unknown'}</p>
              <p>Country(s): {film ? film.countries : 'Unknown'}</p>
            </div>
          </div>

          <div className={classes.FilmRatingsWrapper}>
            <h3 className={classes.RatingsHeader}>Ratings</h3>
            <Toggle onClick={handleToggle} checked={sortByTCI} label={'Sort by TCI'} />

            {!isLoadingRatings ? (
              <div className={classes.FilmRatings}>
                {ratings.length !== 0 ? (
                  ratings.map((rating: IRating) => (
                    <div className={classes.UserRatingWrapper} key={rating.username}>
                      <UserAvatar username={rating.username} />
                      <p
                        className={classes.UserRatingScore}
                        style={{ color: determineColourGradient(rating.ratingPercentile) }}
                      >
                        {rating.rating}
                        <span className={classes.UserRatingPercentile}>{rating.ratingPercentile}%</span>
                      </p>
                      <p className={classes.UserRating}>
                        <Link href={`#profile/${rating.username}`}>{rating.username}</Link>
                      </p>
                      <p className={classes.UserTCI}>TCI: {getTCI(rating.username)}</p>
                      <div className={classes.UserReviewTextWrapper}>
                        {rating.review ? <p className={classes.UserReviewText}>{rating.review}</p> : null}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No ratings found</p>
                )}
              </div>
            ) : (
              <Spinner />
            )}
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </PageView>
  );
};

export default Film;
