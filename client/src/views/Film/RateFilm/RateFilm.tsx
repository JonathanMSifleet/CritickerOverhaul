import * as endpoints from '../../../constants/endpoints';

import { ChangeEvent, FC, useState } from 'react';

import Button from '../../../components/Button/Button';
import IUserState from '../../../interfaces/IUserState';
import Input from '../../../components/Input/Input';
import SpinnerButton from '../../../components/SpinnerButton/SpinnerButton';
import classes from './RateFilm.module.scss';
import httpRequest from '../../../utils/httpRequest';

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

  const inputChangedHandler = (event: React.ChangeEvent<HTMLInputElement>, inputName: string): void => {
    inputName === 'rating' ? setUserRating(Number(event.target.value)) : setUserReview(event.target.value);
  };

  const rateFilm = async (): Promise<void> => {
    setIsRating(true);

    try {
      await httpRequest(`${endpoints.RATE_FILM}/${userState.username}`, 'POST', {
        imdb_title_id: Number(filmID),
        rating: userRating,
        review: userReview,
        reviewAlreadyExists
      });
    } catch (error) {
      console.error(error);
    }

    setHasSubmittedRating(true);
    setIsRating(false);
  };

  return (
    <div className={classes.RateFilmWrapper}>
      <form onSubmit={(event): void => event.preventDefault()}>
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>): void => inputChangedHandler(event, 'rating')}
          placeholder={'Rating'}
          type={'text'}
        />
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>): void => inputChangedHandler(event, 'review')}
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
