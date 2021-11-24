import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../../elements/Button/Button';
import Input from '../../../elements/Input/Input';
import Context from '../../../hooks/store/context';
import {
  getFilmByIDURL,
  rateFilmURL
} from '../../../shared/constants/endpoints';
import getIMDbFilmPoster from '../../../shared/functions/getFilmImage';
import HTTPRequest from '../../../shared/functions/HTTPRequest';
import PageView from '../../hoc/PageView/PageView';
import classes from './Film.module.scss';

const Film: React.FC = () => {
  const [film, setFilm] = useState(null as unknown as any);
  const [filmPoster, setFilmPoster] = useState('');
  const { id } = useParams<{ id: string }>();
  const [rating, setRating] = useState(null as unknown as number);
  const { globalState } = useContext(Context);

  // must use useEffect hook to use async functions
  // rather than returning await asyncFunc()
  useEffect(() => {
    async function getFilmPoster() {
      setFilmPoster(await getIMDbFilmPoster(id));
      setFilm(await HTTPRequest(`${getFilmByIDURL}/${id}`, 'get'));
    }

    getFilmPoster();
  }, [id]);

  const inputChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setRating(Number(event.target.value));
  };

  const rateFilm = async () => {
    await HTTPRequest(rateFilmURL, 'post', {
      id: Number(id),
      userID: globalState.userInfo.UID,
      rating
    });
  };

  return (
    <PageView>
      <div className={classes.PageWrapper}>
        <div className={classes.FilmDetails}>
          <img className={classes.Poster} src={filmPoster} />
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
          {globalState.userInfo.loggedIn ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <Input
                className={classes.RateFilm}
                onChange={(event) => inputChangedHandler(event)}
                placeholder={'Rating'}
                type={'text'}
              />
              <Button
                className={`${classes.SubmitButton} btn btn-primary btn-block mb-4`}
                onClick={() => rateFilm()}
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
