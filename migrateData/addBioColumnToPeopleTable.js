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

  const sql = 'ALTER TABLE people ADD COLUMN bio VARCHAR(34000)';

  await shared.executeSQL(asyncQuery, sql, 'Column added');

  populateTable();
});

const populateTable = async () => {
  await csvtojson()
    .fromFile('./datasets/Bios.csv')
    .then(async (source) => {
      const updateStatement =
        'UPDATE people SET bio = ? WHERE people.imdb_name_id = ?';
      const numRows = source.length;

      let i = 0;
      for await (const row of source) {
        i++;

        try {
          if (!row.bio) continue;

          const items = [row.bio, row.imdb_name_id];

          await shared.insertRow(
            connection,
            updateStatement,
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
