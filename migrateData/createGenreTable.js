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

  let sql;

  sql = 'DROP TABLE IF EXISTS genres';
  await shared.executeSQL(asyncQuery, sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE genres (genre_id TINYINT AUTO_INCREMENT, ' +
    'genre_name VARCHAR(16) UNIQUE, PRIMARY KEY (genre_id))';
  await shared.executeSQL(asyncQuery, sql, 'Table created');

  const genres = await fetchGenres();
  genres.sort();
  console.log('All genres fetched');

  await populateTable(genres);
});

const fetchGenres = async () => {
  const genresToReturn = [];

  await csvtojson()
    .fromFile('./datasets/Genres.csv')
    .then(async (source) => {
      const numRows = source.length;

      let i = 0;
      for await (const genreRow of source) {
        i++;

        let genres = genreRow.genre;
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

const populateTable = async (genres) => {
  const insertStatement = 'INSERT INTO genres VALUES (null,?)';
  const numRows = genres.length;
  let i = 0;

  console.log('Inserting genres');

  for await (const item of genres) {
    i++;

    await shared.insertApostropheRow(
      connection,
      insertStatement,
      item,
      i,
      numRows
    );
  }
};
