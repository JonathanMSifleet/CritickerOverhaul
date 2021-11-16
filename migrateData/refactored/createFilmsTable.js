// based on:
// https://www.geeksforgeeks.org/how-to-import-data-from-csv-file-into-mysql-table-using-node-js/

const mysql = require('mysql2');
const util = require('util');
const csvtojson = require('csvtojson');
const shared = require('../shared/shared');

const connection = mysql.createConnection(shared.connectionDetails);
const asyncQuery = util.promisify(connection.query).bind(connection);

connection.connect(async (err) => {
  if (err) throw err;
  console.log('Connected to database');

  let sql;

  sql = 'DROP TABLE IF EXISTS films';
  await shared.executeSQL(asyncQuery, sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE films (imdb_title_id MEDIUMINT UNSIGNED, title VARCHAR(224), ' +
    'year SMALLINT, duration SMALLINT, description VARCHAR(512), ' +
    'PRIMARY KEY (imdb_title_id))';
  await shared.executeSQL(asyncQuery, sql, 'Table created');

  populateTable();
});

const populateTable = () => {
  csvtojson()
    .fromFile('./datasets/IMDb_movies_usable_no_inline_commas.csv')
    .then(async (source) => {
      // Fetching the data from each row
      // and inserting to the table "sample"

      const numRows = source.length;
      const insertStatement = 'INSERT INTO films VALUES (?, ?, ?, ?, ?)';

      let i = 0;
      for await (const film of source) {
        i++;

        const { imdb_title_id, title, year, duration, description } = film;
        const items = [imdb_title_id, title, year, duration, description];

        await shared.insertApostropheRow(
          connection,
          insertStatement,
          items,
          i,
          numRows
        );
      }
    });
};
