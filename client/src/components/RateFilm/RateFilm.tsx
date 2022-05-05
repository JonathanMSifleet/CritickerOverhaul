import * as endpoints from '../../constants/endpoints';
import { FC, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../../store';
import Button from '../Button/Button';
import classes from './RateFilm.module.scss';
import httpRequest from '../../utils/httpRequest';
import Input from '../Input/Input';
import SpinnerButton from '../SpinnerButton/SpinnerButton';

interface IProps {
  filmID: number;
  reviewAlreadyExists: boolean;
  setHasSubmittedRating: (hasSubmittedRating: boolean) => void;
}

const RateFilm: FC<IProps> = ({ filmID, reviewAlreadyExists, setHasSubmittedRating }): JSX.Element => {
  const [isRating, setIsRating] = useState(false);
  const [userRating, setUserRating] = useState(null as null | number);
  const [userReview, setUserReview] = useState(null as null | string);
  const userState = useRecoilValue(userInfoState);

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

      if (result.statusCode === 401) {
        throw new Error('Invalid access token');
      } else {
        setHasSubmittedRating(true);
      }
    } finally {
      setIsRating(false);
    }
  };

  return (
    <div className={classes.RateFilmWrapper}>
      <Input
        onChange={(event): void => inputChangedHandler(event.target.value, 'rating')}
        placeholder={'Rating'}
        type={'text'}
      />
      <div className={classes.ReviewInputWrapper}>
        <Input
          onChange={(event): void => inputChangedHandler(event.target.value, 'review')}
          placeholder={'Review'}
          type={'text'}
          textarea={true}
        />
      </div>

      {!isRating ? (
        <Button
          className={`${classes.SubmitButton} btn btn-primary btn-block mb-4`}
          onClick={(): Promise<void> => rateFilm()}
          text={'Rate film'}
        />
      ) : (
        <SpinnerButton />
      )}
    </div>
  );
};

export default RateFilm;
