import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import getIMDbFilmPoster from '../../../../shared/functions/getFilmImage';
import IFilm from '../../../../shared/interfaces/IFilm';
import classes from './FilmCard.module.scss';

interface IProps {
  film: IFilm;
}

const FilmCard: React.FC<IProps> = ({ film }): JSX.Element => {
  const [filmPoster, setFilmPoster] = useState('');

  useEffect(() => {
    async function getFilmPoster() {
      setFilmPoster(await getIMDbFilmPoster(film.imdb_title_id));
    }
    getFilmPoster();
  }, []);

  return (
    <div className={`${classes.CardWrapper} card mb-3`}>
      <div className={`${classes.CardContainer} row g-0`}>
        <div className={`${classes.ImageColumn} col-md-1`}>
          <img
            src={filmPoster}
            className={`${classes.Image} img-fluid rounded-start`}
          />
        </div>
        <div className={`${classes.TextColumn} col-md-8`}>
          <div className={`${classes.CardBody} card-body`}>
            <Link to={`/film/${film.imdb_title_id}`}>
              <h5 className="card-title">
                {film.title} ({film.year})
              </h5>
            </Link>
            <p className="card-text">{film.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmCard;
