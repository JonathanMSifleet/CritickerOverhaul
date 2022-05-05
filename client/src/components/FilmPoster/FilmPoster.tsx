import { FC } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
import getFilmPoster from '../../utils/getFilmPoster';
import ShrugSVG from '../../assets/svg/Shrug.svg';
import Spinner from '../Spinner/Spinner';

interface IProps {
  className: string;
  imdbID: number;
}

const FilmPoster: FC<IProps> = ({ className, imdbID }) => {
  const [filmPoster, setFilmPoster] = useState(null as null | string);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async (): Promise<void> => {
      setIsLoading(true);

      try {
        setFilmPoster(await getFilmPoster(imdbID));
      } catch (error) {
        setFilmPoster(ShrugSVG);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return <> {!isLoading ? <img src={filmPoster!} className={className} /> : <Spinner />}</>;
};

export default FilmPoster;
