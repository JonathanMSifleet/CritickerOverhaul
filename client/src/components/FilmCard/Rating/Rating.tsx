import { FC, useEffect, useState } from 'preact/compat';
import classes from './Rating.module.scss';
import ColouredText from '../../ColouredText/ColouredText';
import getColourGradient from '../../../utils/getColourGradient';
import getUserRating from '../../../utils/getUserRating';
import IFilm from '../../../../../shared/interfaces/IFilm';
import IRating from '../../../../../shared/interfaces/IRating';
import IUserState from '../../../interfaces/IUserState';
import RateFilm from '../../RateFilm/RateFilm';
import RatingOptions from '../../RatingOptions/RatingOptions';
import Spinner from '../../Spinner/Spinner';

interface IProps {
  film: IFilm;
  userState: IUserState;
}

const Rating: FC<IProps> = ({ film, userState }) => {
  const [fetchedUserReview, setFetchedUserReview] = useState(null as null | IRating);
  const [hasSubmittedRating, setHasSubmittedRating] = useState(false);
  const [isDeletingReview, setIsDeletingReview] = useState(false);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [reviewAlreadyExists, setReviewAlreadyExists] = useState(false);

  useEffect(() => {
    if (hasSubmittedRating)
      (async (): Promise<void> => {
        setIsLoadingReview(true);

        try {
          const result = await getUserRating(userState.username, film.imdbID);

          if (result) {
            setHasSubmittedRating(true);
            setFetchedUserReview(result as IRating);
            setReviewAlreadyExists(true);
          }
        } finally {
          setIsLoadingReview(false);
        }
      })();
  }, [hasSubmittedRating]);

  return (
    <div className={`${classes.RateFilmWrapper} col-md-3`}>
      <div className={classes.RateFilm}>
        {!isLoadingReview && !isDeletingReview ? (
          <>
            {fetchedUserReview !== null ? (
              <>
                <ColouredText
                  className={classes.ColouredText}
                  colourGradient={getColourGradient(fetchedUserReview!.ratingPercentile!)}
                  text={fetchedUserReview!.rating}
                />
                <p
                  className={classes.RatingPercentile}
                  style={{ color: getColourGradient(fetchedUserReview!.ratingPercentile!) }}
                >
                  {fetchedUserReview?.ratingPercentile}%
                </p>
                <RatingOptions
                  className={classes.RatingOptions}
                  imdbID={film.imdbID}
                  setFetchedUserReview={(review): void => setFetchedUserReview(review as IRating)}
                  setHasSubmittedRating={(hasSubmittedRating): void => setHasSubmittedRating(hasSubmittedRating)}
                  setIsDeletingReview={(isDeletingReview): void => setIsDeletingReview(isDeletingReview)}
                  setReviewAlreadyExists={(reviewAlreadyExists): void => setReviewAlreadyExists(reviewAlreadyExists)}
                  userState={userState}
                />
              </>
            ) : (
              <RateFilm
                filmID={film.imdbID}
                reviewAlreadyExists={reviewAlreadyExists}
                setHasSubmittedRating={(hasSubmittedRating: boolean): void => setHasSubmittedRating(hasSubmittedRating)}
              />
            )}
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default Rating;
