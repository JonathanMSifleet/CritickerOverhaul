import ShrugSVG from '../../assets/svg/Shrug.svg';
import TMDbAPIKey from '../constants/TMDbAPIKey';
import convertIDToIMDbFormat from './convertIDToIMDbFormat';
import HTTPRequest from './HTTPRequest';

const getIMDbFilmPoster = async (imdb_title_id: string) => {
  imdb_title_id = convertIDToIMDbFormat('film', imdb_title_id);

  const url = `https://api.themoviedb.org/3/find/${imdb_title_id}?api_key=${TMDbAPIKey}&external_source=imdb_id`;
  const response = await HTTPRequest(url, 'get');

  const poster = response.movie_results[0].poster_path;
  if (poster) {
    return `http://image.tmdb.org/t/p/original${poster}`;
  } else {
    return ShrugSVG;
  }
};

export default getIMDbFilmPoster;
