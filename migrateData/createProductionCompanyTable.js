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

  let sql = 'DROP TABLE IF EXISTS companies';
  await shared.executeSQL(asyncQuery, sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE companies (company_id SMALLINT UNSIGNED AUTO_INCREMENT, ' +
    'company_name VARCHAR(128) UNIQUE, PRIMARY KEY (company_id))';
  await shared.executeSQL(asyncQuery, sql, 'Table created');

  const companies = await fetchCompanies();
  companies.sort();
  console.log('All companies fetched');
  try {
    await shared.populateTableFromArray(connection, companies, 'companies');
  } catch (err) {
    console.error(err);
  }
});

const fetchCompanies = async () => {
  const companiesToReturn = [];

  await csvtojson()
    .fromFile('./datasets/Production_companies.csv')
    .then(async (source) => {
      const numRows = source.length;

      let i = 0;
      for await (const row of source) {
        i++;

        let companies = row.production_company;
        companies = companies.split(', ');

        shared.percentRemaining(i, numRows);
        companies.forEach((curCompany) => {
          if (!companiesToReturn.includes(curCompany)) {
            companiesToReturn.push(curCompany);
          }
        });
      }
    });

  return companiesToReturn;
};
