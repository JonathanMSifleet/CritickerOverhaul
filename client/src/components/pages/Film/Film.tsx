import { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { GET_FILM_BY_PARAM, RATE_FILM } from '../../../constants/endpoints';
import { userInfoState } from '../../../store';
import getFilmPoster from '../../../utils/getFilmPoster';
import HTTPRequest from '../../../utils/httpRequest';
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
  const [rating, setRating] = useState(null as unknown as number);
  const [userState] = useRecoilState(userInfoState);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);
      setFilmPoster(await getFilmPoster(id!));
      setFilm(await HTTPRequest(`${GET_FILM_BY_PARAM}/${id}`, 'GET'));
      setIsLoading(false);
    })();
  }, [id]);

  const inputChangedHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRating(Number(event.target.value));
  };

  const rateFilm = async (): Promise<void> => {
    const response = await HTTPRequest(RATE_FILM, 'POST', {
      id: Number(id),
      UID: userState!.UID,
      rating
    });
    console.log('rate film response', response);
  };

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
                    className={classes.RateFilm}
                    onChange={(event: ChangeEvent<HTMLInputElement>): void =>
                      inputChangedHandler(event)
                    }
                    placeholder={'Rating'}
                    type={'text'}
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
