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

  let sql = 'DROP TABLE IF EXISTS people_bios';
  await shared.executeSQL(asyncQuery, sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE people_bios (imdb_name_id MEDIUMINT UNSIGNED, bio VARCHAR(34000), ' +
    'PRIMARY KEY (imdb_name_id), ' +
    'FOREIGN KEY (imdb_name_id) REFERENCES people(imdb_name_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE)';

  await shared.executeSQL(asyncQuery, sql, 'Table created');

  populateTable();
});

const populateTable = async () => {
  await csvtojson()
    .fromFile('./datasets/ToMigrate/Bios.csv')
    .then(async (source) => {
      const insertStatement = 'INSERT IGNORE INTO people_bios VALUES (?, ?)';
      const numRows = source.length;

      let i = 0;
      for await (const row of source) {
        i++;

        try {
          if (!row.bio) continue;

          const items = [row.imdb_name_id, row.bio];

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
    });
};
