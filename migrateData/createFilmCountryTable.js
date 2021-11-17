// based on:
// https://www.geeksforgeeks.org/how-to-import-data-from-csv-file-into-mysql-table-using-node-js/

const mysql = require('mysql2');
const util = require('util');
const csvtojson = require('csvtojson');
const shared = require('./shared/shared');

const connection = mysql.createConnection(shared.connectionDetails);
const asyncQuery = util.promisify(connection.query).bind(connection);

connection.connect(async (err) => {
  if (err) throw err;
  console.log('Connected to database');

  await shared.executeSQL(
    asyncQuery,
    'DROP TABLE IF EXISTS film_countries',
    'Table dropped if exists'
  );

  const sql =
    'CREATE TABLE film_countries (imdb_title_id MEDIUMINT UNSIGNED, country_id TINYINT UNSIGNED, ' +
    'PRIMARY KEY (imdb_title_id, country_id), ' +
    'FOREIGN KEY (imdb_title_id) REFERENCES films(imdb_title_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE, ' +
    'FOREIGN KEY (country_id) REFERENCES countries(country_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE)';
  await shared.executeSQL(asyncQuery, sql, 'Table created');

  populateTable();
});

const populateTable = () => {
  csvtojson()
    .fromFile('./datasets/Film_Countries.csv')
    .then(async (source) => {
      const insertStatement = 'INSERT IGNORE INTO film_countries VALUES (?, ?)';
      const numRows = source.length;

      let i = 0;
      for await (const row of source) {
        i++;

        let { imdb_title_id, countries } = row;
        countries = countries.split(', ');

        for await (const curCountry of countries) {
          if (curCountry) {
            try {
              const country_id = await shared.getForeignField(
                connection,
                'country_id',
                'countries',
                'country_name',
                curCountry
              );

              const items = [imdb_title_id, country_id];

              await shared.insertRow(
                connection,
                insertStatement,
                items,
                i,
                numRows
              );
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
    });
};
