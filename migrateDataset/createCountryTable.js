// based on:
// https://www.geeksforgeeks.org/how-to-import-data-from-csv-file-into-mysql-table-using-node-js/

const mysql = require('mysql2');
const csvtojson = require('csvtojson');
const util = require('util');

const connectionDetails = {
  host: 'localhost',
  user: 'JonathanS',
  password: 'DatasetMigration',
  database: 'critickeroverhaul'
};

const connection = mysql.createConnection(connectionDetails);
const query = util.promisify(connection.query).bind(connection);

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');

  let sql;

  sql = 'DROP TABLE IF EXISTS countries';
  executeSQL(sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE countries (country_id int NOT NULL AUTO_INCREMENT, ' +
    'country_name VARCHAR(64) UNIQUE, PRIMARY KEY (country_id))';
  executeSQL(sql, 'Table created');

  populateTable();
});

const executeSQL = (sql, message) => {
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(message);
  });
};

const populateTable = () => {
  csvtojson()
    .fromFile('./datasets/Countries.csv')
    .then(async (source) => {
      const numRows = source.length;

      for (let i = 0; i < numRows; i++) {
        const countryRow = source[i]['country'];
        const countries = countryRow.split(', ');

        countries.forEach((el) => {
          const insertStatement =
            'INSERT IGNORE INTO countries VALUES (null, ?)';
          insertRow(i, numRows, insertStatement, el);
        });
      }
    });
};

const insertRow = (i, numRows, insertStatement, items) => {
  connection.query(insertStatement, items, (err, results, fields) => {
    if (err) {
      console.log('Unable to insert item at row ', i++);
      return console.log(err);
    }
    console.log(`Row ${i} of ${numRows}`);
  });
};
