import ShrugSVG from '../../assets/svg/Shrug.svg';
import TMDbAPIKey from '../constants/TMDbAPIKey';
import convertIDToIMDbFormat from './convertIDToIMDbFormat';

const getIMDbFilmPoster = async (imdb_title_id: string) => {
  imdb_title_id = convertIDToIMDbFormat('film', imdb_title_id);

  const url = `https://api.themoviedb.org/3/find/${imdb_title_id}?api_key=${TMDbAPIKey}&external_source=imdb_id`;

  let response = (await fetch(url, { method: 'get' })) as any;
  response = await response.json();

  const poster = response.movie_results[0].poster_path;
  if (poster) {
    return `http://image.tmdb.org/t/p/original${response.movie_results[0].poster_path}`;
  } else {
    return ShrugSVG;
  }
};

export default getIMDbFilmPoster;
