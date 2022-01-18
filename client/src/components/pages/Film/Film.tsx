import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import Button from '../../../elements/Button/Button';
import Input from '../../../elements/Input/Input';
import { userInfoState } from '../../../recoilStore/store';
import { GET_FILM_BY_PARAM, RATE_FILM } from '../../../shared/constants/endpoints';
import getIMDbFilmPoster from '../../../shared/functions/getFilmImage';
import HTTPRequest from '../../../shared/functions/HTTPRequest';
import PageView from '../../hoc/PageView/PageView';
import classes from './Film.module.scss';

const Film: React.FC = () => {
  const [film, setFilm] = useState(null as any);
  const [filmPoster, setFilmPoster] = useState(null as string | null);
  const [rating, setRating] = useState(null as unknown as number);
  const [userState] = useRecoilState(userInfoState);

  const { id } = useParams<{ id: string }>();

  // must use useEffect hook to use async functions
  // rather than returning await asyncFunc()
  useEffect(() => {
    async function getFilmData(): Promise<void> {
      setFilmPoster(await getIMDbFilmPoster(id!));
      setFilm(await HTTPRequest(`${GET_FILM_BY_PARAM}/${id}`, 'GET'));
    }

    getFilmData();
  }, [id]);

  const inputChangedHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRating(Number(event.target.value));
  };

  const rateFilm = async (): Promise<void> => {
    console.log(userState);
    await HTTPRequest(RATE_FILM, 'POST', {
      id: Number(id),
      UID: userState!.UID,
      rating
    });
  };

  return (
    <PageView>
      <div className={classes.PageWrapper}>
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
            <form
              onSubmit={(event): void => {
                event.preventDefault();
              }}
            >
              <Input
                className={classes.RateFilm}
                onChange={(event): void => inputChangedHandler(event)}
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
      </div>
    </PageView>
  );
};

export default Film;
