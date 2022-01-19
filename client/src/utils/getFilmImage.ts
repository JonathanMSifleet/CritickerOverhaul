import ShrugSVG from '../../assets/svg/Shrug.svg';
import TMDbAPIKey from '../constants/TMDbAPIKey';
import convertIDToIMDbFormat from './convertIDToIMDbFormat';
import httpRequest from './httpRequest';

const getIMDbFilmPoster = async (imdb_title_id: string): Promise<string> => {
  imdb_title_id = convertIDToIMDbFormat('film', imdb_title_id);

  const url = `https://api.themoviedb.org/3/find/${imdb_title_id}?api_key=${TMDbAPIKey}&external_source=imdb_id`;
  const response = await httpRequest(url, 'GET');

  console.log('response', response);

  const poster = response.movie_results[0].poster_path;
  return poster ? `http://image.tmdb.org/t/p/original${poster}` : ShrugSVG;
};

export default getIMDbFilmPoster;
