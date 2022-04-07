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
    'ALTER TABLE people ADD COLUMN DOBirth BIGINT',
    'Column added'
  );

  populateTable();
});

const populateTable = async () => {
  await csvtojson()
    .fromFile('./datasets/DOBs.csv')
    .then(async (source) => {
      const updateStatement = `UPDATE people SET DOBirth = ? WHERE people.imdb_name_id = ?`;
      const numRows = source.length;

      let i = 0;
      for await (const row of source) {
        i++;

        let date = shared.getDate(row.DOB);

        const items = [date, row.imdb_name_id];

        try {
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
