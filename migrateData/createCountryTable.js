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

  let sql = 'DROP TABLE IF EXISTS countries';
  await shared.executeSQL(asyncQuery, sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE countries (country_id TINYINT UNSIGNED AUTO_INCREMENT, ' +
    'country_name VARCHAR(64) UNIQUE, PRIMARY KEY (country_id))';
  await shared.executeSQL(asyncQuery, sql, 'Table created');

  const countries = await fetchCountries();
  countries.sort();
  console.log('All countries fetched');

  await shared.populateTableFromArray(connection, countries, 'countries');
});

const fetchCountries = async () => {
  const countriesToReturn = [];

  await csvtojson()
    .fromFile('./datasets/Countries.csv')
    .then(async (source) => {
      const numRows = source.length;

      let i = 0;
      for await (const row of source) {
        i++;

        let countries = row.country;
        countries = countries.split(', ');

        shared.percentRemaining(i, numRows);
        countries.forEach((curCountry) => {
          if (!countriesToReturn.includes(curCountry)) {
            countriesToReturn.push(curCountry);
          }
        });
      }
    });

  return countriesToReturn;
};
