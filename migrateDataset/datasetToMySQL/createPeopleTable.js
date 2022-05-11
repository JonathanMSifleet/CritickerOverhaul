const mysql = require('mysql2');
const util = require('util');
const csvtojson = require('csvtojson');
const shared = require('./shared/shared');

const connection = mysql.createConnection(shared.connectionDetails);
const asyncQuery = util.promisify(connection.query).bind(connection);

connection.connect(async (err) => {
  if (err) throw err;
  console.log('Connected to database');

  let sql = 'DROP TABLE IF EXISTS people';
  await shared.executeSQL(asyncQuery, sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE people (imdb_name_id MEDIUMINT UNSIGNED, ' +
    'name VARCHAR(64), PRIMARY KEY (imdb_name_id))';
  await shared.executeSQL(asyncQuery, sql, 'Table created');

  try {
    await populateTable();
  } catch (e) {
    console.error(e);
  }
});

const populateTable = async () => {
  await csvtojson()
    .fromFile('./datasets/People.csv')
    .then(async (source) => {
      const insertStatement = 'INSERT INTO people VALUES (?, ?)';
      const numRows = source.length;

      let i = 0;
      for await (const row of source) {
        i++;

        const items = [row.imdb_name_id, row.name];

        try {
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
