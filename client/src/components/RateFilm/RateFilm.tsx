import * as endpoints from '../../constants/endpoints';
import { FC, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../../store';
import { validateInput } from '../../../../shared/functions/validationFunctions';
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
  const [ratingValMessages, setRatingValMessages] = useState(null as null | string[]);
  const [reviewValMessages, setReviewValMessages] = useState(null as null | string[]);
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

  const validateRating = async (value: string): Promise<void> => {
    let messages = (await validateInput(value, 'Rating')) as string[];
    messages = messages.filter((error) => error !== null);

    setRatingValMessages(messages);
  };

  const validateReview = async (value: string): Promise<void> => {
    let messages = (await validateInput(value, 'Review')) as string[];
    messages = messages.filter((error) => error !== null);

    setReviewValMessages(messages);
  };

  return (
    <div className={classes.RateFilmWrapper}>
      <Input
        autoComplete={'off'}
        errors={ratingValMessages!}
        onChange={(event): void => {
          inputChangedHandler(event.target.value, 'rating');
          validateRating(event.target.value);
        }}
        placeholder={'Rating'}
        type={'text'}
      />

      {ratingValMessages && ratingValMessages.length === 0 && userRating !== null && userRating !== 0 ? (
        <div className={classes.ReviewInputWrapper}>
          <Input
            autoComplete={'off'}
            errors={reviewValMessages!}
            onChange={(event): void => {
              inputChangedHandler(event.target.value, 'review');
              validateReview(event.target.value);
            }}
            placeholder={'Review'}
            type={'text'}
            textarea={true}
          />
        </div>
      ) : null}

      {!isRating ? (
        ratingValMessages && ratingValMessages!.length === 0 && reviewValMessages && reviewValMessages!.length === 0 ? (
          <Button
            className={`${classes.SubmitButton} btn btn-primary btn-block mb-4`}
            onClick={(): Promise<void> => rateFilm()}
            text={'Rate film'}
          />
        ) : null
      ) : (
        <SpinnerButton />
      )}
    </div>
  );
};

export default RateFilm;
