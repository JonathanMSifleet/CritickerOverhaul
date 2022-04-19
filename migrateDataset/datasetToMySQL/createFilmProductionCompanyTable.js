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
    'DROP TABLE IF EXISTS film_companies',
    'Table dropped if exists'
  );

  const sql =
    'CREATE TABLE film_companies (imdb_title_id MEDIUMINT UNSIGNED, company_id SMALLINT UNSIGNED, ' +
    'PRIMARY KEY (imdb_title_id, company_id), ' +
    'FOREIGN KEY (company_id) REFERENCES companies(company_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE, ' +
    'FOREIGN KEY (imdb_title_id) REFERENCES films(imdb_title_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE)';

  await shared.executeSQL(asyncQuery, sql, 'Table created');

  populateTable();
});

const populateTable = async () => {
  await csvtojson()
    .fromFile('./datasets/Film_Production_Companies.csv')
    .then(async (source) => {
      const insertStatement = 'INSERT IGNORE INTO film_companies VALUES (?, ?)';
      const numRows = source.length;

      let i = 0;
      for await (const row of source) {
        i++;

        const companies = row.companies.split(', ');

        for await (const curCompany of companies) {
          try {
            const company_id = await shared.getForeignField(
              connection,
              'company_id',
              'companies',
              'company_name',
              curCompany
            );

            const items = [row.imdb_title_id, company_id];

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
    });
};
