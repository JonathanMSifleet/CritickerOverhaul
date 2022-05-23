import { FC } from 'preact/compat';
import { Link } from 'preact-router/match';
import { Suspense } from 'preact/compat';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../../store';
import classes from './FilmCard.module.scss';
import FilmPoster from '../FilmPoster/FilmPoster';
import IFilm from '../../../../shared/interfaces/IFilm';
import Rating from './Rating/Rating';
import Spinner from '../Spinner/Spinner';

interface IProps {
  film: IFilm;
}

const FilmCard: FC<IProps> = ({ film }): JSX.Element => {
  const userState = useRecoilValue(userInfoState);

  return (
    <div className={`${classes.CardWrapper} card mb-3`}>
      <div className={`${classes.CardContainer} row g-0`}>
        <div className={`${classes.ImageColumn} col-md-1`}>
          <FilmPoster className={`${classes.Image} img-fluid rounded-start`} imdbID={film.imdbID} />
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

        {userState.loggedIn ? (
          // @ts-expect-error
          <Suspense fallback={<Spinner />}>
            <Rating film={film} userState={userState} />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
};

export default FilmCard;
