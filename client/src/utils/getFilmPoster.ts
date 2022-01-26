import ShrugSVG from '../assets/svg/Shrug.svg';
import TMDB_API_KEY from '../constants/TMDbAPIKey';
import convertIDToIMDbFormat from './convertIDToIMDbFormat';
import httpRequest from './httpRequest';

const getFilmPoster = async (imdb_title_id: string): Promise<string> => {
  imdb_title_id = convertIDToIMDbFormat('film', imdb_title_id);

  const url = `https://api.themoviedb.org/3/find/${imdb_title_id}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
  const response = await httpRequest(url, 'GET');

  const poster = response.movie_results[0].poster_path;
  return poster ? `http://image.tmdb.org/t/p/original${poster}` : ShrugSVG;
};

export default getFilmPoster;
