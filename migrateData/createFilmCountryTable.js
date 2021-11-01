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

  executeSQL('DROP TABLE IF EXISTS film_countries', 'Table dropped if exists');

  const sql =
    'CREATE TABLE film_countries (imdb_title_id MEDIUMINT UNSIGNED, country_id TINYINT UNSIGNED, ' +
    'PRIMARY KEY (imdb_title_id, country_id), ' +
    'FOREIGN KEY (imdb_title_id) REFERENCES critickeroverhaul.films(imdb_title_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE, ' +
    'FOREIGN KEY (country_id) REFERENCES critickeroverhaul.countries(country_id) ' +
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
    .fromFile('./datasets/Film_Countries.csv')
    .then(async (source) => {
      for (let i = 0; i < source.length; i++) {
        const imdb_title_id = source[i]['imdb_title_id'];
        let countries = source[i]['country'];
        countries = countries.split(', ');

        for await (const curCountry of countries) {
          try {
            const country_id = await getCountryName(curCountry);
            const insertStatement = `INSERT IGNORE INTO film_countries VALUES ('${imdb_title_id}', '${country_id}')`;

            await executeSQL(insertStatement, i);
          } catch (e) {
            console.error(e);
          }
        }
      }
    });
};

const getCountryName = async (curCountry) => {
  const selectStatement =
    'SELECT country_id FROM critickeroverhaul.countries ' +
    `WHERE critickeroverhaul.countries.country_name = '${curCountry}'`;

  try {
    const rows = await query(selectStatement);
    return rows[0]['country_id'];
  } catch (e) {
    console.error(e);
  }
};
