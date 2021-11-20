import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import getIMDbFilmPoster from '../../../functions/getFilmImage';
import { getFilmByIDURL } from '../../../shared/endpoints';
import PageView from '../../hoc/PageLayout/PageView/PageView';
import classes from './Film.module.scss';

const Film: React.FC = () => {
  const [film, setFilm] = useState(null as unknown as any);
  const [filmPoster, setFilmPoster] = useState('');
  const { id } = useParams<{ id: string }>();

  // must use useEffect hook to use async functions
  // rather than returning await asyncFunc()
  useEffect(() => {
    async function getFilmPoster() {
      setFilmPoster(await getIMDbFilmPoster(id));

      let response = await fetch(`${getFilmByIDURL}/${id}`, {
        method: 'get'
      });
      response = await response.json();
      setFilm(response);
    }
    getFilmPoster();
  }, []);

  return (
    <PageView>
      <div className={classes.PageWrapper}>
        <div className={classes.FilmIntro}>
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
      </div>
    </PageView>
  );
};

export default Film;
