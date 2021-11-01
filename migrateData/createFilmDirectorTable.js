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

  executeSQL('DROP TABLE IF EXISTS film_directors', 'Table dropped if exists');

  const sql =
    'CREATE TABLE film_directors (imdb_name_id MEDIUMINT UNSIGNED, imdb_title_id MEDIUMINT UNSIGNED, ' +
    'PRIMARY KEY (imdb_name_id, imdb_title_id), ' +
    'FOREIGN KEY (imdb_name_id) REFERENCES critickeroverhaul.people(imdb_name_id) ' +
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
    .fromFile('./datasets/Film_Directors.csv')
    .then(async (source) => {
      for (let i = 0; i < source.length; i++) {
        const imdb_title_id = source[i]['imdb_title_id'];
        let directorNames = source[i]['director'];
        directorNames = directorNames.split(', ');

        for await (const curDirector of directorNames) {
          try {
            const imdb_name_id = await getIMDbName(curDirector);
            const insertStatement = `INSERT IGNORE INTO film_directors VALUES ('${imdb_name_id}', '${imdb_title_id}')`;

            await executeSQL(insertStatement, i);
          } catch (e) {
            console.error(e);
          }
        }
      }
    });
};

const getIMDbName = async (curDirector) => {
  const selectStatement =
    'SELECT imdb_name_id FROM critickeroverhaul.people ' +
    `WHERE critickeroverhaul.people.name = '${curDirector}'`;

  try {
    const rows = await query(selectStatement);
    return rows[0]['imdb_name_id'];
  } catch (e) {
    console.error(e);
  }
};
