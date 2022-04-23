import * as endpoints from '../../../constants/endpoints';
import { FC, useState } from 'react';
import Button from '../../../components/Button/Button';
import classes from './RateFilm.module.scss';
import httpRequest from '../../../utils/httpRequest';
import Input from '../../../components/Input/Input';
import IUserState from '../../../interfaces/IUserState';
import SpinnerButton from '../../../components/SpinnerButton/SpinnerButton';

interface IProps {
  filmID: number;
  reviewAlreadyExists: boolean;
  setHasSubmittedRating: (hasSubmittedRating: boolean) => void;
  userState: IUserState;
}

const RateFilm: FC<IProps> = ({ filmID, reviewAlreadyExists, setHasSubmittedRating, userState }): JSX.Element => {
  const [isRating, setIsRating] = useState(false);
  const [userRating, setUserRating] = useState(null as null | number);
  const [userReview, setUserReview] = useState(null as null | string);

  const inputChangedHandler = (value: string, inputName: string): void =>
    inputName === 'rating' ? setUserRating(Number(value)) : setUserReview(value);

  const rateFilm = async (): Promise<void> => {
    setIsRating(true);

    try {
      const result = await httpRequest(`${endpoints.RATE_FILM}/${userState.username}`, 'POST', userState.accessToken, {
        imdbID: Number(filmID),
        rating: userRating,
        review: userReview,
        reviewAlreadyExists
      });

      if (result.statusCode === 401) throw new Error('Invalid access token');
      setHasSubmittedRating(true);
    } catch (error) {
      alert(error);
      setHasSubmittedRating(false);
    } finally {
      setIsRating(false);
    }
  };

  return (
    <div className={classes.RateFilmWrapper}>
      <form onSubmit={(event): void => event.preventDefault()}>
        <Input
          onChange={(event): void => inputChangedHandler(event.target.value, 'rating')}
          placeholder={'Rating'}
          type={'text'}
        />
        <Input
          onChange={(event): void => inputChangedHandler(event.target.value, 'review')}
          placeholder={'Review'}
          type={'text'}
          textarea={true}
        />

        {isRating ? (
          <SpinnerButton />
        ) : (
          <Button
            className={`${classes.SubmitButton} btn btn-primary btn-block mb-4`}
            onClick={(): Promise<void> => rateFilm()}
            text={'Rate film'}
          />
        )}
      </form>
    </div>
  );
};

export default RateFilm;
