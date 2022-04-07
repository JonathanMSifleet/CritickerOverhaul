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

  let sql = 'DROP TABLE IF EXISTS films';
  await shared.executeSQL(asyncQuery, sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE films (imdb_title_id MEDIUMINT UNSIGNED, title VARCHAR(224), ' +
    'year SMALLINT, duration SMALLINT, description VARCHAR(512), ' +
    'PRIMARY KEY (imdb_title_id))';
  await shared.executeSQL(asyncQuery, sql, 'Table created');

  populateTable();
});

const populateTable = async () => {
  await csvtojson()
    .fromFile('./datasets/IMDb_movies_usable_no_inline_commas.csv')
    .then(async (source) => {
      const insertStatement = 'INSERT INTO films VALUES (?, ?, ?, ?, ?)';
      const numRows = source.length;

      let i = 0;
      for await (const row of source) {
        i++;
        const items = [
          row.imdb_title_id,
          row.title,
          row.year,
          row.duration,
          row.description
        ];

        await shared.insertRow(connection, insertStatement, items, i, numRows);
      }
    });
};
