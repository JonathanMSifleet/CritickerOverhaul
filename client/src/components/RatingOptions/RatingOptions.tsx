import * as endpoints from '../../constants/endpoints';
import { FC } from 'preact/compat';
import classes from './RatingOptions.module.scss';
import httpRequest from '../../utils/httpRequest';
import IRating from '../../../../shared/interfaces/IRating';
import IUserState from '../../interfaces/IUserState';

interface IProps {
  className?: string;
  imdbID: number;
  setFetchedUserReview: (fetchedUserReview: IRating | null) => void;
  setHasSubmittedRating: (hasSubmittedRating: boolean) => void;
  setIsDeletingReview: (isDeletingReview: boolean) => void;
  setReviewAlreadyExists: (hasSubmittedRating: boolean) => void;
  userState: IUserState;
}

const RatingOptions: FC<IProps> = ({
  className,
  imdbID,
  setFetchedUserReview,
  setHasSubmittedRating,
  setIsDeletingReview,
  setReviewAlreadyExists,
  userState
}) => {
  const deleteReview = async (): Promise<void> => {
    setIsDeletingReview(true);

    try {
      const result = await httpRequest(
        `${endpoints.DELETE_RATING}/${imdbID}/${userState.username}/${userState.accessToken.accessToken}`,
        'DELETE',
        userState.accessToken
      );
      console.log('🚀 ~ file: Film.tsx ~ line 119 ~ deleteReview ~ result', result);

      if (result.statusCode === 401) throw new Error('Invalid access token');
      if (result.statusCode === 500) throw new Error('Error deleting rating');

      setFetchedUserReview(null);
      setHasSubmittedRating(false);
    } catch (error) {
      alert(error);
    } finally {
      setIsDeletingReview(false);
    }
  };

  return (
    <p className={`${classes.RatingOptions} ${className}`}>
      <span
        className={classes.ModifyReview}
        onClick={(): void => {
          setFetchedUserReview(null);
          setHasSubmittedRating(false);
          setReviewAlreadyExists(true);
        }}
      >
        Update
      </span>
      {' - '}
      <span className={classes.ModifyReview} onClick={deleteReview}>
        Delete
      </span>
    </p>
  );
};

export default RatingOptions;
