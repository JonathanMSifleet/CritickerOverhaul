// based on:
// https://www.geeksforgeeks.org/how-to-import-data-from-csv-file-into-mysql-table-using-node-js/

const mysql = require('mysql2');
const csvtojson = require('csvtojson');

const connectionDetails = {
  host: 'localhost',
  user: 'JonathanS',
  password: 'DatasetMigration',
  database: 'critickeroverhaul'
};

const connection = mysql.createConnection(connectionDetails);

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');

  let sql;

  sql = 'DROP TABLE IF EXISTS directors';
  executeSQL(sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE directors (director_id MEDIUMINT NOT NULL AUTO_INCREMENT, ' +
    'director_name VARCHAR(64) UNIQUE, PRIMARY KEY (director_id))';
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
    .fromFile('./datasets/Directors.csv')
    .then((source) => {
      const numRows = source.length;

      for (let i = 0; i < numRows; i++) {
        const directorRow = source[i]['director'];
        const directors = directorRow.split(', ');

        directors.forEach((el) => {
          const insertStatement =
            'INSERT IGNORE INTO directors VALUES (null, ?)';
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
