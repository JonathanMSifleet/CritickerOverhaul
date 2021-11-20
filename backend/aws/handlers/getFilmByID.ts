import middy from '@middy/core';
import cors from '@middy/http-cors';
import serverlessMysql from 'serverless-mysql';
import { createAWSResErr } from '../shared/functions/createAWSResErr';
import IHTTP from '../shared/interfaces/IHTTP';
import IHTTPErr from '../shared/interfaces/IHTTPErr';
import { connectionDetails } from '../shared/MySQL/ConnectionDetails';
const mysql = serverlessMysql({ config: connectionDetails });

const getFilmByID = async (event: {
  pathParameters: { id: string };
}): Promise<IHTTP | IHTTPErr> => {
  const { id } = event.pathParameters;

  const sql =
    'SELECT films.year, films.title, ' +
    'films.duration, films.description, ' +
    "GROUP_CONCAT(DISTINCT genres.genre_name ORDER BY genres.genre_name ASC SEPARATOR ', ') AS genres, " +
    "GROUP_CONCAT(DISTINCT pd.name ORDER BY pd.name ASC SEPARATOR ', ') AS directors, " +
    "GROUP_CONCAT(DISTINCT pw.name ORDER BY pw.name ASC SEPARATOR ', ') AS writers, " +
    "GROUP_CONCAT(DISTINCT pa.name ORDER BY pa.name ASC SEPARATOR ', ') AS actors, " +
    "GROUP_CONCAT(DISTINCT language_name ORDER BY language_name ASC SEPARATOR ', ') AS languages, " +
    "GROUP_CONCAT(DISTINCT country_name ORDER BY country_name ASC SEPARATOR ', ') AS countries " +
    'FROM films ' +
    'LEFT JOIN film_directors ' +
    'ON films.imdb_title_id = film_directors.imdb_title_id ' +
    'LEFT JOIN people as pd ' +
    'ON film_directors.imdb_name_id = pd.imdb_name_id ' +
    'LEFT JOIN film_writers ' +
    'ON films.imdb_title_id = film_writers.imdb_title_id ' +
    'LEFT JOIN people as pw ' +
    'ON film_writers.imdb_name_id = pw.imdb_name_id ' +
    'LEFT JOIN film_actors ' +
    'ON films.imdb_title_id = film_actors.imdb_title_id ' +
    'LEFT JOIN people AS pa ' +
    'ON film_actors.imdb_name_id = pa.imdb_name_id ' +
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

  try {
    const result = (await mysql.query(sql, [id])) as any;
    mysql.quit();

    console.log('Sucessfully fetched results');
    return {
      statusCode: 200,
      body: JSON.stringify(result[0])
    };
  } catch (e: any) {
    return createAWSResErr(500, e);
  }
};

export const handler = middy(getFilmByID).use(cors());
