import { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { GET_FILM_BY_PARAM, RATE_FILM } from '../../../constants/endpoints';
import { userInfoState } from '../../../store';
import getFilmPoster from '../../../utils/getFilmPoster';
import httpRequest from '../../../utils/httpRequest';
import Button from '../../elements/Button/Button';
import Input from '../../elements/Input/Input';
import Spinner from '../../elements/Spinner/Spinner';
import PageView from '../../hoc/PageView/PageView';
import classes from './Film.module.scss';

const Film: React.FC = () => {
  // to do
  const [film, setFilm] = useState(null as any);
  const [filmPoster, setFilmPoster] = useState(null as string | null);
  const [isLoading, setIsLoading] = useState(false);
  // to do
  const [userReview, setUserReview] = useState(
    null as unknown as { rating: number; reviewText: string }
  );
  const [userState] = useRecoilState(userInfoState);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);

      const [film, filmPoster] = [
        await httpRequest(`${GET_FILM_BY_PARAM}/${id}`, 'GET'),
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

  const rateFilm = async (): Promise<void> =>
    await httpRequest(RATE_FILM, 'POST', {
      imdb_title_id: Number(id),
      UID: userState!.UID,
      review: { ...userReview }
    });

  return (
    <PageView>
      <div className={classes.PageWrapper}>
        {isLoading ? (
          <Spinner />
        ) : (
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

                  <Button
                    className={`${classes.SubmitButton} btn btn-primary btn-block mb-4`}
                    onClick={(): Promise<void> => rateFilm()}
                    text={'Rate film'}
                  />
                </form>
              ) : null}
            </div>
          </>
        )}
      </div>
    </PageView>
  );
};

export default Film;
