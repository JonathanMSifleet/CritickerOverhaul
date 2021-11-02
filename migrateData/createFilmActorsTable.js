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

  executeSQL('DROP TABLE IF EXISTS film_actors', 'Table dropped if exists');

  const sql =
    'CREATE TABLE film_actors (imdb_title_id MEDIUMINT UNSIGNED, imdb_name_id MEDIUMINT UNSIGNED, ' +
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
    .fromFile('./datasets/Film_Actors.csv')
    .then(async (source) => {
      for (let i = 0; i < source.length; i++) {
        const imdb_title_id = source[i]['imdb_title_id'];
        let actorNames = source[i]['actors'];
        actorNames = actorNames.split(', ');

        for await (const curActor of actorNames) {
          try {
            const imdb_name_id = await getIMDbName(curActor);
            const insertStatement = `INSERT IGNORE INTO film_actors VALUES ('${imdb_title_id}', '${imdb_name_id}')`;

            await executeSQL(insertStatement, i);
          } catch (e) {
            console.error(e);
          }
        }
      }
    });
};

const getIMDbName = async (curActor) => {
  const selectStatement =
    'SELECT imdb_name_id FROM critickeroverhaul.people ' +
    `WHERE critickeroverhaul.people.name = '${curActor}'`;

  try {
    const rows = await query(selectStatement);
    return rows[0]['imdb_name_id'];
  } catch (e) {
    console.error(e);
  }
};
