import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import * as endpoints from '../../../constants/endpoints';
import { userInfoState } from '../../../store';
import getFilmPoster from '../../../utils/getFilmPoster';
import httpRequest from '../../../utils/httpRequest';
import Button from '../../elements/Button/Button';
import Input from '../../elements/Input/Input';
import Spinner from '../../elements/Spinner/Spinner';
import SpinnerButton from '../../elements/SpinnerButton/SpinnerButton';
import PageView from '../../hoc/PageView/PageView';
import classes from './Film.module.scss';

interface IProps {
  id?: string;
}

const Film: FC<IProps> = ({ id }) => {
  // to do
  const [film, setFilm] = useState(null as any);
  const [filmPoster, setFilmPoster] = useState(null as string | null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRating, setIsRating] = useState(false);
  // to do
  const [userReview, setUserReview] = useState(
    null as unknown as { rating: number; reviewText: string }
  );
  const [userState] = useRecoilState(userInfoState);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);

      const [film, filmPoster] = [
        await httpRequest(`${endpoints.GET_FILM_BY_PARAM}/${id}`, 'GET'),
        await getFilmPoster(id!)
      ];

      setFilm(film);
      setFilmPoster(filmPoster);

      setIsLoading(false);
    })();
  }, [id]);

  const inputChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    inputName: string
  ): void => {
    if (inputName === 'rating') {
      setUserReview({ ...userReview, [inputName]: Number(event.target.value) });
    } else {
      setUserReview({ ...userReview, [inputName]: event.target.value });
    }
  };

  const rateFilm = async (): Promise<void> => {
    setIsRating(true);

    try {
      const ratingResponse = await httpRequest(endpoints.RATE_FILM, 'POST', {
        imdb_title_id: Number(id),
        UID: userState!.UID,
        review: { ...userReview }
      });
      console.log('🚀 ~ file: Film.tsx ~ line 65 ~ rateFilm ~ ratingResponse', ratingResponse);
    } catch (error) {
      console.error(error);
    }

    setIsRating(false);
  };

  return (
    <PageView>
      <div className={classes.PageWrapper}>
        {!isLoading ? (
          <>
            <div className={classes.FilmDetails}>
              <img className={classes.Poster} src={filmPoster!} />
              <h1>{film ? film.title : null}</h1>
              <p>{film ? film.description : null}</p>

              <h2>Cast and information</h2>
              <p>Directed by: {film ? film.directors : 'Unknown'}</p>
              <p>Written by: {film ? film.writers : 'Unknown'} </p>
              <p>Starring: {film ? film.actors : 'Unknown'}</p>
              <p>Genre(s): {film ? film.genres : 'Unknown'}</p>
              <p>Language(s): {film ? film.languages : 'Unknown'}</p>
              <p>Country(s): {film ? film.countries : 'Unknown'}</p>
            </div>

            <div className={classes.RateFilmWrapper}>
              {userState!.loggedIn ? (
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
              ) : null}
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
