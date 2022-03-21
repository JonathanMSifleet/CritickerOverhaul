import IFilm from './../../../../shared/interfaces/IFilm';
import { ServerlessMysql } from 'serverless-mysql';

const getIndividualFilmDetails = async (
  id: number,
  mysql: ServerlessMysql,
  page: string
): Promise<IFilm | undefined> => {
  switch (page) {
    case 'allRatings':
      return await getAllRatingsDetails(id, mysql);
    case 'filmPage':
      return await getFilmPageDetails(id, mysql);
  }
};

export default getIndividualFilmDetails;

const getAllRatingsDetails = async (id: number, mysql: ServerlessMysql): Promise<IFilm> => {
  const filmSQL = mainSQL.replace('films.description,', 'films.imdbID,');

  const getFilm = mysql.query(filmSQL, [id]);
  const getDirector = mysql.query(directorSQL, [id]);
  const getWriters = mysql.query(writerSQL, [id]);

  const [film, director, writers] = (await Promise.all([getFilm, getDirector, getWriters])) as any;

  return {
    ...film[0],
    ...director[0],
    ...writers[0]
  };
};

const getFilmPageDetails = async (id: number, mysql: ServerlessMysql): Promise<IFilm> => {
  const getFilm = mysql.query(mainSQL, [id]);
  const getDirector = mysql.query(directorSQL, [id]);
  const getWriters = mysql.query(writerSQL, [id]);
  const getOrderedFilmActors = mysql.query(orderedActorSQL, [id]);
  const getUnorderedActorResult = mysql.query(unorderedActorSQL, [id, id]);

  const [film, director, writers, filmActors, unorderedFilmActors] = (await Promise.all([
    getFilm,
    getDirector,
    getWriters,
    getOrderedFilmActors,
    getUnorderedActorResult
  ])) as any;

  const result = {
    ...film[0],
    ...director[0],
    ...writers[0],
    ...filmActors[0]
  };

  if (unorderedFilmActors[0].actors) result.actors = `${result.actors}, ${unorderedFilmActors[0].actors}`;
  return result;
};

const mainSQL =
  'SELECT films.year, films.title, ' +
  'films.duration, films.description, ' +
  "GROUP_CONCAT(DISTINCT genres.genre_name ORDER BY genres.genre_name ASC SEPARATOR ', ') AS genres, " +
  "GROUP_CONCAT(DISTINCT language_name ORDER BY language_name ASC SEPARATOR ', ') AS languages, " +
  "GROUP_CONCAT(DISTINCT country_name ORDER BY country_name ASC SEPARATOR ', ') AS countries " +
  'FROM films ' +
  'LEFT JOIN film_genres ' +
  'ON films.imdbID = film_genres.imdbID ' +
  'LEFT JOIN genres ' +
  'ON film_genres.genre_id =  genres.genre_id ' +
  'LEFT JOIN film_languages ' +
  'ON films.imdbID = film_languages.imdbID ' +
  'LEFT JOIN languages ' +
  'ON film_languages.language_id = languages.language_id ' +
  'LEFT JOIN film_countries ' +
  'ON films.imdbID = film_countries.imdbID ' +
  'LEFT JOIN countries ' +
  'ON film_countries.country_id = countries.country_id ' +
  'WHERE films.imdbID = ? ' +
  'GROUP BY films.imdbID';

const directorSQL =
  "SELECT GROUP_CONCAT(DISTINCT people.name ORDER BY people.name ASC SEPARATOR ', ') AS directors " +
  'FROM people ' +
  'LEFT JOIN film_directors ' +
  'ON film_directors.imdb_name_id = people.imdb_name_id ' +
  'WHERE film_directors.imdbID = ?';

const writerSQL =
  "SELECT GROUP_CONCAT(DISTINCT people.name ORDER BY people.name ASC SEPARATOR ', ') AS writers " +
  'FROM people ' +
  'LEFT JOIN film_writers ' +
  'ON film_writers.imdb_name_id = people.imdb_name_id ' +
  'WHERE film_writers.imdbID = ?';

const orderedActorSQL =
  "SELECT GROUP_CONCAT(DISTINCT people.name ORDER BY film_actor_ordering.ordering ASC SEPARATOR ', ') AS actors " +
  'FROM film_actor_ordering ' +
  'LEFT JOIN people ' +
  'ON film_actor_ordering.imdb_name_id = people.imdb_name_id ' +
  'WHERE film_actor_ordering.imdbID = ? ' +
  'GROUP BY film_actor_ordering.imdbID';

const unorderedActorSQL =
  "SELECT GROUP_CONCAT(DISTINCT name ORDER BY name ASC SEPARATOR ', ') AS actors " +
  'FROM ( ' +
  '  SELECT imdbID, imdb_name_id FROM film_actors ' +
  '  WHERE imdbID = ? ' +
  '  EXCEPT ' +
  '  SELECT imdbID, imdb_name_id FROM film_actor_ordering ' +
  '  WHERE imdbID = ? ' +
  ') as fromSubQuery ' +
  'LEFT JOIN people ' +
  'ON fromSubQuery.imdb_name_id = people.imdb_name_id';
