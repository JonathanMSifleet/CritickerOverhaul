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

  sql = 'DROP TABLE IF EXISTS writers';
  executeSQL(sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE writers (writer_id MEDIUMINT NOT NULL AUTO_INCREMENT, ' +
    'writer_name VARCHAR(64) UNIQUE, PRIMARY KEY (writer_id))';
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
    .fromFile('./datasets/Writers.csv')
    .then((source) => {
      const numRows = source.length;

      for (let i = 0; i < numRows; i++) {
        const writerRow = source[i]['writer'];
        const writers = writerRow.split(', ');

        writers.forEach((el) => {
          const insertStatement =
            'INSERT IGNORE INTO writers VALUES (null, ?)';
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
