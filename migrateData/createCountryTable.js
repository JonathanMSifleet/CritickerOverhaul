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

  sql = 'DROP TABLE IF EXISTS countries';
  executeSQL(sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE countries (country_id TINYINT UNSIGNED AUTO_INCREMENT, ' +
    'country_name VARCHAR(64) UNIQUE, PRIMARY KEY (country_id))';
  executeSQL(sql, 'Table created');

  const countries = await fetchCountries();
  countries.sort();

  await populateTable(countries);
  console.log('All rows inserted');
});

const fetchCountries = async () => {
  const countriesToReturn = [];

  await csvtojson()
    .fromFile('./datasets/Countries.csv')
    .then((source) => {
      const numRows = source.length;

      for (let i = 0; i < numRows; i++) {
        const countryRow = source[i]['country'];
        const countries = countryRow.split(', ');

        countries.forEach((curCountry) => {
          curCountry = curCountry.replaceAll("'", "''");

          if (!countriesToReturn.includes(curCountry)) {
            countriesToReturn.push(curCountry);
          }
        });
      }
    });

  return countriesToReturn;
};

const executeSQL = async (sql) => {
  try {
    return await query(sql);
  } catch (e) {
    console.error(e);
  }
};

const populateTable = async (countries) => {
  await countries.forEach(async (curCountry) => {
    executeSQL(
      `INSERT INTO critickeroverhaul.countries VALUES (null, '${curCountry}')`
    );
  });
};
