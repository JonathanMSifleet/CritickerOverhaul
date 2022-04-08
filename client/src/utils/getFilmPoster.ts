import convertIDToIMDbFormat from './convertIDToIMDbFormat';
import httpRequest from './httpRequest';
import ShrugSVG from '../assets/svg/Shrug.svg';

const getFilmPoster = async (imdbID: number): Promise<string> => {
  const formattedID = convertIDToIMDbFormat('film', imdbID);

  const tmdbKey = '2a6fdeb294b4f2342ca8a611d7ecab34';

  const url = `https://api.themoviedb.org/3/find/${formattedID}?api_key=${tmdbKey}&external_source=imdb_id`;

  const response = await httpRequest(url, 'GET');

  try {
    const poster = response.movie_results[0].poster_path;
    return `http://image.tmdb.org/t/p/original${poster}`;
  } catch (error) {
    return ShrugSVG;
  }
};

export default getFilmPoster;
