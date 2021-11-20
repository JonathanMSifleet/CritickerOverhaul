// based on:
// https://www.geeksforgeeks.org/how-to-import-data-from-csv-file-into-mysql-table-using-node-js/

const mysql = require('mysql2');
const util = require('util');
const csvtojson = require('csvtojson');
const shared = require('./shared/shared');

const connection = mysql.createConnection(shared.connectionDetails);
const asyncQuery = util.promisify(connection.query).bind(connection);

connection.connect(async (err) => {
  if (err) throw err;
  console.log('Connected to database');

  await shared.executeSQL(
    asyncQuery,
    'DROP TABLE IF EXISTS film_genres',
    'Table dropped if exists'
  );

  const sql =
    'CREATE TABLE film_genres (imdb_title_id MEDIUMINT UNSIGNED, genre_id TINYINT, ' +
    'PRIMARY KEY (imdb_title_id, genre_id), ' +
    'FOREIGN KEY (genre_id) REFERENCES genres(genre_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE, ' +
    'FOREIGN KEY (imdb_title_id) REFERENCES films(imdb_title_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE)';

  await shared.executeSQL(asyncQuery, sql, 'Table created');

  populateTable();
});

const populateTable = async () => {
  await csvtojson()
    .fromFile('./datasets/Film_Genres.csv')
    .then(async (source) => {
      const insertStatement = 'INSERT IGNORE INTO film_genres VALUES (?, ?)';
      const numRows = source.length;

      let i = 0;
      for await (const row of source) {
        i++;

        const genres = row.genres.split(', ');

        for await (const curGenre of genres) {
          try {
            const genre_id = await shared.getForeignField(
              connection,
              'genre_id',
              'genres',
              'genre_name',
              curGenre
            );

            const items = [row.imdb_title_id, genre_id];

            await shared.insertRow(
              connection,
              insertStatement,
              items,
              i,
              numRows
            );
          } catch (e) {
            console.error(e);
          }
        }
      }
    });
};
