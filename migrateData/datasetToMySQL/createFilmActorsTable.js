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
    'DROP TABLE IF EXISTS film_actors',
    'Table dropped if exists'
  );

  const sql =
    'CREATE TABLE film_actors (imdb_title_id MEDIUMINT UNSIGNED, imdb_name_id MEDIUMINT UNSIGNED, ' +
    'PRIMARY KEY (imdb_name_id, imdb_title_id), ' +
    'FOREIGN KEY (imdb_name_id) REFERENCES people(imdb_name_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE, ' +
    'FOREIGN KEY (imdb_title_id) REFERENCES films(imdb_title_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE)';
  await shared.executeSQL(asyncQuery, sql, 'Table created');

  populateTable();
});

const populateTable = async () => {
  await csvtojson()
    .fromFile('./datasets/Film_Actors.csv')
    .then(async (source) => {
      const insertStatement = 'INSERT IGNORE INTO film_actors VALUES (?, ?)';
      const numRows = source.length;

      let i = 0;
      for await (const row of source) {
        i++;

        const actors = row.actors.split(', ');

        for await (const curActor of actors) {
          try {
            const imdb_name_id = await shared.getForeignField(
              connection,
              'imdb_name_id',
              'people',
              'name',
              curActor
            );

            const items = [row.imdb_title_id, imdb_name_id];

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
