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

  executeSQL(
    'DROP TABLE IF EXISTS film_production_companies',
    'Table dropped if exists'
  );

  sql =
    'CREATE TABLE film_production_companies (imdb_title_id MEDIUMINT UNSIGNED, company_id SMALLINT UNSIGNED, ' +
    'PRIMARY KEY (imdb_title_id, company_id), ' +
    'FOREIGN KEY (company_id) REFERENCES critickeroverhaul.production_companies(company_id) ' +
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
    .fromFile('./datasets/Film_Production_Companies.csv')
    .then(async (source) => {
      for (let i = 0; i < source.length; i++) {
        const imdb_title_id = source[i]['imdb_title_id'];
        let companies = source[i]['production_company'];
        companies = companies.split(', ');

        for await (const curCompany of companies) {
          try {
            const company_id = await getCompanyName(curCompany);
            const insertStatement = `INSERT IGNORE INTO film_production_companies VALUES ('${imdb_title_id}', '${company_id}')`;

            await executeSQL(insertStatement, i);
          } catch (e) {
            console.error(e);
          }
        }
      }
    });
};

const getCompanyName = async (curCompany) => {
  const selectStatement =
    'SELECT company_id FROM critickeroverhaul.production_companies ' +
    `WHERE critickeroverhaul.production_companies.company_name = '${curCompany}'`;

  try {
    const rows = await query(selectStatement);
    return rows[0]['company_id'];
  } catch (e) {
    console.error(e);
  }
};
