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

  let sql = 'DROP TABLE IF EXISTS genres';
  await shared.executeSQL(asyncQuery, sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE genres (genre_id TINYINT AUTO_INCREMENT, ' +
    'genre_name VARCHAR(16) UNIQUE, PRIMARY KEY (genre_id))';
  await shared.executeSQL(asyncQuery, sql, 'Table created');

  const genres = await fetchGenres();
  genres.sort();
  console.log('All genres fetched');

  await shared.populateTableFromArray(connection, genres, 'genres');
});

const fetchGenres = async () => {
  const genresToReturn = [];

  await csvtojson()
    .fromFile('./datasets/Genres.csv')
    .then(async (source) => {
      const numRows = source.length;

      let i = 0;
      for await (const row of source) {
        i++;

        let genres = row.genre;
        genres = genres.split(', ');

        shared.percentRemaining(i, numRows);
        genres.forEach((curGenre) => {
          if (!genresToReturn.includes(curGenre)) {
            genresToReturn.push(curGenre);
          }
        });
      }
    });

  return genresToReturn;
};
