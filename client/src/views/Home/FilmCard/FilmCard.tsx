import { FC, useEffect, useState } from 'react';

import { Link } from 'preact-router/match';
import classes from './FilmCard.module.scss';
import getFilmPoster from '../../../utils/getFilmPoster';
import IFilm from '../../../../../shared/interfaces/IFilm';
import ShrugSVG from '../../../assets/svg/Shrug.svg';
import Spinner from '../../../components/Spinner/Spinner';

interface IProps {
  film: IFilm;
}

const FilmCard: FC<IProps> = ({ film }): JSX.Element => {
  const [filmPoster, setFilmPoster] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);

      try {
        setFilmPoster(await getFilmPoster(film.imdbID));
      } catch (error) {
        setFilmPoster(ShrugSVG);
      } finally {
        setIsLoading(false);
      }
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
            <Link href={`/film/${film.imdbID}`}>
              <h5 className={`${classes.FilmTitle} card-title`}>
                {film.title} ({film.releaseYear})
              </h5>
            </Link>
            <p className={`${classes.FilmDescription} card-text`}>{film.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmCard;
