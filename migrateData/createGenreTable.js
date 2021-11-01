// based on:
// https://www.geeksforgeeks.org/how-to-import-data-from-csv-file-into-mysql-table-using-node-js/

const mysql = require('mysql2');
const util = require('util');
const csvtojson = require('csvtojson');

const connectionDetails = {
  host: 'localhost',
  user: 'JonathanS',
  password: 'DatasetMigration',
  database: 'critickeroverhaul'
};

const connection = mysql.createConnection(connectionDetails);
const query = util.promisify(connection.query).bind(connection);

connection.connect(async (err) => {
  if (err) throw err;
  console.log('Connected to database');

  let sql;

  sql = 'DROP TABLE IF EXISTS genres';
  executeSQL(sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE genres (genre_id TINYINT AUTO_INCREMENT, ' +
    'genre_name VARCHAR(16) UNIQUE, PRIMARY KEY (genre_id))';
  executeSQL(sql, 'Table created');

  const genres = await fetchGenres();
  genres.sort();

  await populateTable(genres);
  console.log('All rows inserted');
});

const fetchGenres = async () => {
  const genresToReturn = [];

  await csvtojson()
    .fromFile('./datasets/Genres.csv')
    .then((source) => {
      const numRows = source.length;

      for (let i = 0; i < numRows; i++) {
        const genreRow = source[i]['genre'];
        const genres = genreRow.split(', ');

        genres.forEach((curGenre) => {
          curGenre = curGenre.replaceAll("'", "''");

          if (!genresToReturn.includes(curGenre)) {
            genresToReturn.push(curGenre);
          }
        });
      }
    });

  return genresToReturn;
};

const executeSQL = async (sql) => {
  try {
    return await query(sql);
  } catch (e) {
    console.error(e);
  }
};

const populateTable = async (genres) => {
  await genres.forEach(async (curGenre) => {
    executeSQL(
      `INSERT INTO critickeroverhaul.genres VALUES (null, '${curGenre}')`
    );
  });
};
