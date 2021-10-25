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

  sql = 'DROP TABLE IF EXISTS genres';
  executeSQL(sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE genres (genre_id int NOT NULL AUTO_INCREMENT, ' +
    'genre_name VARCHAR(16) UNIQUE, PRIMARY KEY (genre_id))';
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
    .fromFile('./datasets/Genres.csv')
    .then((source) => {
      const numRows = source.length;

      for (let i = 0; i < numRows; i++) {
        const genreRow = source[i]['genre'];
        const genres = genreRow.split(', ');

        genres.forEach((el) => {
          const insertStatement = 'INSERT IGNORE INTO genres VALUES (null, ?)';
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
