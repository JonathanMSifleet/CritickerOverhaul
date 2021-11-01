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

  executeSQL('DROP TABLE IF EXISTS film_genres', 'Table dropped if exists');

  sql =
    'CREATE TABLE film_genres (imdb_title_id MEDIUMINT UNSIGNED, genre_id TINYINT, ' +
    'PRIMARY KEY (imdb_title_id, genre_id), ' +
    'FOREIGN KEY (genre_id) REFERENCES critickeroverhaul.genres(genre_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE, ' +
    'FOREIGN KEY (imdb_title_id) REFERENCES critickeroverhaul.films(imdb_title_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE)';

  executeSQL(sql, 'Table created');

  populateTable();
});

const executeSQL = async (sql, i) => {
  try {
    await query(sql);
    console.log(i);
  } catch (e) {
    console.error(e);
    process.exit();
  }
};

const populateTable = () => {
  csvtojson()
    .fromFile('./datasets/Film_Genres.csv')
    .then(async (source) => {
      for (let i = 0; i < source.length; i++) {
        const imdb_title_id = source[i]['imdb_title_id'];
        let genres = source[i]['genre'];
        genres = genres.split(', ');

        for await (const curGenre of genres) {
          try {
            const genre_id = await getGenreName(curGenre);
            const insertStatement = `INSERT IGNORE INTO film_genres VALUES ('${imdb_title_id}', '${genre_id}')`;

            await executeSQL(insertStatement, i);
          } catch (e) {
            console.error(e);
          }
        }
      }
    });
};

const getGenreName = async (curGenre) => {
  const selectStatement =
    'SELECT genre_id FROM critickeroverhaul.genres ' +
    `WHERE critickeroverhaul.genres.genre_name = '${curGenre}'`;

  try {
    const rows = await query(selectStatement);
    return rows[0]['genre_id'];
  } catch (e) {
    console.error(e);
  }
};
