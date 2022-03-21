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
  const filmSQL = mainSQL.replace('films.description,', 'films.imdb_title_id,');

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
  'ON films.imdb_title_id = film_genres.imdb_title_id ' +
  'LEFT JOIN genres ' +
  'ON film_genres.genre_id =  genres.genre_id ' +
  'LEFT JOIN film_languages ' +
  'ON films.imdb_title_id = film_languages.imdb_title_id ' +
  'LEFT JOIN languages ' +
  'ON film_languages.language_id = languages.language_id ' +
  'LEFT JOIN film_countries ' +
  'ON films.imdb_title_id = film_countries.imdb_title_id ' +
  'LEFT JOIN countries ' +
  'ON film_countries.country_id = countries.country_id ' +
  'WHERE films.imdb_title_id = ? ' +
  'GROUP BY films.imdb_title_id';

const directorSQL =
  "SELECT GROUP_CONCAT(DISTINCT people.name ORDER BY people.name ASC SEPARATOR ', ') AS directors " +
  'FROM people ' +
  'LEFT JOIN film_directors ' +
  'ON film_directors.imdb_name_id = people.imdb_name_id ' +
  'WHERE film_directors.imdb_title_id = ?';

const writerSQL =
  "SELECT GROUP_CONCAT(DISTINCT people.name ORDER BY people.name ASC SEPARATOR ', ') AS writers " +
  'FROM people ' +
  'LEFT JOIN film_writers ' +
  'ON film_writers.imdb_name_id = people.imdb_name_id ' +
  'WHERE film_writers.imdb_title_id = ?';

const orderedActorSQL =
  "SELECT GROUP_CONCAT(DISTINCT people.name ORDER BY film_actor_ordering.ordering ASC SEPARATOR ', ') AS actors " +
  'FROM film_actor_ordering ' +
  'LEFT JOIN people ' +
  'ON film_actor_ordering.imdb_name_id = people.imdb_name_id ' +
  'WHERE film_actor_ordering.imdb_title_id = ? ' +
  'GROUP BY film_actor_ordering.imdb_title_id';

const unorderedActorSQL =
  "SELECT GROUP_CONCAT(DISTINCT name ORDER BY name ASC SEPARATOR ', ') AS actors " +
  'FROM ( ' +
  '  SELECT imdb_title_id, imdb_name_id FROM film_actors ' +
  '  WHERE imdb_title_id = ? ' +
  '  EXCEPT ' +
  '  SELECT imdb_title_id, imdb_name_id FROM film_actor_ordering ' +
  '  WHERE imdb_title_id = ? ' +
  ') as fromSubQuery ' +
  'LEFT JOIN people ' +
  'ON fromSubQuery.imdb_name_id = people.imdb_name_id';
