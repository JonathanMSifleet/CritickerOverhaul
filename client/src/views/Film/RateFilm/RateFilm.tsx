import { ChangeEvent, FC, useState } from 'react';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import SpinnerButton from '../../../components/SpinnerButton/SpinnerButton';
import * as endpoints from '../../../constants/endpoints';
import IUserState from '../../../interfaces/IUserState';
import httpRequest from '../../../utils/httpRequest';
import classes from './RateFilm.module.scss';

interface IProps {
  filmID: number;
  setHasSubmittedRating: (hasSubmittedRating: boolean) => void;
  userState: IUserState;
}

const RateFilm: FC<IProps> = ({ filmID, setHasSubmittedRating, userState }): JSX.Element => {
  const [isRating, setIsRating] = useState(false);
  const [userReview, setUserReview] = useState(null as null | {
      rating: number;
      reviewText?: string;
  });

  const inputChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    inputName: string
  ): void => {
    inputName === 'rating'
      ? setUserReview({ ...userReview!, [inputName]: Number(event.target.value) })
      : setUserReview({ ...userReview!, [inputName]: event.target.value });
  };

  const rateFilm = async (): Promise<void> => {
    setIsRating(true);

    try {
      await httpRequest(endpoints.RATE_FILM, 'POST', {
        imdb_title_id: Number(filmID),
        UID: userState!.UID,
        review: { ...userReview }
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
          onChange={(event: ChangeEvent<HTMLInputElement>): void =>
            inputChangedHandler(event, 'rating')
          }
          placeholder={'Rating'}
          type={'text'}
        />
        <Input
          onChange={(event: ChangeEvent<HTMLInputElement>): void =>
            inputChangedHandler(event, 'reviewText')
          }
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
