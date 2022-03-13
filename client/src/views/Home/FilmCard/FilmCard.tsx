import { Link } from 'preact-router/match';
import { FC, useEffect, useState } from 'react';
import IFilm from '../../../../../shared/interfaces/IFilm';
import getFilmPoster from '../../../utils/getFilmPoster';
import Spinner from '../../../components/Spinner/Spinner';
import classes from './FilmCard.module.scss';

interface IProps {
  film: IFilm;
}

const FilmCard: FC<IProps> = ({ film }): JSX.Element => {
  const [filmPoster, setFilmPoster] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);
      setFilmPoster(await getFilmPoster(film.imdb_title_id));
      setIsLoading(false);
    })();
  }, []);

  return (
    <div className={`${classes.CardWrapper} card mb-3`}>
      <div className={`${classes.CardContainer} row g-0`}>
        <div className={`${classes.ImageColumn} col-md-1`}>
          {!isLoading ? (
            <img src={filmPoster} className={`${classes.Image} img-fluid rounded-start`} />
          ) : (
            <div className={classes.SpinnerWrapper}>
              <Spinner />
            </div>
          )}
        </div>
        <div className={`${classes.TextColumn} col-md-8`}>
          <div className={`${classes.CardBody} card-body`}>
            <Link href={`/film/${film.imdb_title_id}`}>
              <h5 className="card-title">
                {film.title} - ({film.year})
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
