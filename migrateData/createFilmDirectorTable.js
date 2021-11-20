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
    'DROP TABLE IF EXISTS film_directors',
    'Table dropped if exists'
  );

  const sql =
    'CREATE TABLE film_directors (imdb_title_id MEDIUMINT UNSIGNED, imdb_name_id MEDIUMINT UNSIGNED, ' +
    'PRIMARY KEY (imdb_name_id, imdb_title_id), ' +
    'FOREIGN KEY (imdb_name_id) REFERENCES people(imdb_name_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE, ' +
    'FOREIGN KEY (imdb_title_id) REFERENCES films(imdb_title_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE)';
  await shared.executeSQL(asyncQuery, sql, 'Table created');

  populateTable();
});

const populateTable = () => {
  await csvtojson()
    .fromFile('./datasets/Film_Directors.csv')
    .then(async (source) => {
      const insertStatement = 'INSERT IGNORE INTO film_directors VALUES (?, ?)';
      const numRows = source.length;

      let i = 0;
      for await (const row of source) {
        i++;

        let { imdb_title_id, directors } = row;
        directors = directors.split(', ');

        for await (const curDirector of directors) {
          try {
            const imdb_name_id = await shared.getForeignField(
              connection,
              'imdb_name_id',
              'people',
              'name',
              curDirector
            );

            const items = [imdb_title_id, imdb_name_id];

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
