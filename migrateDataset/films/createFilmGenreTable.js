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

  sql = 'DROP TABLE IF EXISTS film_genres';
  executeSQL(sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE film_genres (genre_id MEDIUMINT, imdb_title_id MEDIUMINT UNSIGNED, ' +
    'PRIMARY KEY (genre_id, imdb_title_id), ' +
    'FOREIGN KEY (genre_id) REFERENCES critickeroverhaul.genres(genre_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE, ' +
    'FOREIGN KEY (imdb_title_id) REFERENCES critickeroverhaul.films(imdb_title_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE)';
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
    .fromFile('./datasets/Film_Genres.csv')
    .then(async (source) => {
      const numRows = source.length;

      for (let i = 0; i < numRows; i++) {
        const imdb_title_id = source[i]['imdb_title_id'];
        const genreRow = source[i]['genre'];

        const genreName = genreRow.split(', ');

        genreName.forEach(async (el) => {
          const selectStatement =
            'SELECT genre_id FROM critickeroverhaul.genres ' +
            `WHERE critickeroverhaul.genres.genre_name = "${el}"`;

          let genre_id;

          try {
            const rows = await query(selectStatement);
            genre_id = rows[0]['genre_id'];
          } catch (e) {}

          const insertStatement = 'INSERT INTO film_genres VALUES (?, ?)';

          const items = [genre_id, imdb_title_id];

          insertRow(i, numRows, insertStatement, items);
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
