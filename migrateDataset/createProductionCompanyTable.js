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

  sql = 'DROP TABLE IF EXISTS production_companies';
  executeSQL(sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE production_companies (company_id SMALLINT UNSIGNED AUTO_INCREMENT, ' +
    'company_name VARCHAR(128) UNIQUE, PRIMARY KEY (company_id))';
  executeSQL(sql, 'Table created');

  const companies = await fetchCompanies();
  companies.sort();

  await populateTable(companies);
});

const fetchCompanies = async () => {
  const companiesToReturn = [];

  await csvtojson()
    .fromFile('./datasets/Production_companies.csv')
    .then((source) => {
      const numRows = source.length;

      for (let i = 0; i < numRows; i++) {
        const companyRow = source[i]['company_name'];
        const companies = companyRow.split(', ');

        companies.forEach((curCompany) => {
          curCompany = curCompany.replaceAll("'", "''");

          if (!companiesToReturn.includes(curCompany)) {
            companiesToReturn.push(curCompany);
          }
        });
      }
    });

  return companiesToReturn;
};

const executeSQL = async (sql, i) => {
  try {
    await query(sql);
    console.log(i);
  } catch (e) {
    console.error(e);
    process.exit();
  }
};

const populateTable = async (companies) => {
  let i = 0;

  await companies.forEach(async (curCompany) => {
    i++;
    executeSQL(
      `INSERT IGNORE INTO critickeroverhaul.production_companies VALUES (null, '${curCompany}')`,
      i
    );
  });
};
