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

  let sql;

  sql = 'DROP TABLE IF EXISTS film_production_companies';
  executeSQL(sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE film_production_companies (company_id MEDIUMINT, imdb_title_id MEDIUMINT UNSIGNED, ' +
    'PRIMARY KEY (company_id, imdb_title_id), ' +
    'FOREIGN KEY (company_id) REFERENCES critickeroverhaul.production_companies(production_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE, ' +
    'FOREIGN KEY (imdb_title_id) REFERENCES critickeroverhaul.films(imdb_title_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE)';
  executeSQL(sql, 'Table created');

  populateTable();
});

const executeSQL = (sql, message) => {
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(message);
  });
};

const populateTable = () => {
  csvtojson()
    .fromFile('./datasets/Film_Production_Companies.csv')
    .then(async (source) => {
      const numRows = source.length;

      for (let i = 0; i < numRows; i++) {
        const production_company = source[i]['production_company'];
        const imdb_title_id = source[i]['imdb_title_id'];

        const selectStatement =
          'SELECT company_id, company_name FROM critickeroverhaul.production_companies ' +
          `WHERE critickeroverhaul.production_companies.company_name = "${production_company}"`;

        let company_id;

        try {
          const rows = await query(selectStatement);
          company_id = rows[0]['company_id'];
        } catch (e) {}

        let items = [company_id, imdb_title_id];

        const insertStatement =
          'INSERT INTO film_production_companies VALUES (?, ?)';

        insertRow(i, numRows, insertStatement, items);
      }
    });
};

const insertRow = (i, numRows, insertStatement, items) => {
  connection.query(insertStatement, items, (err, results, fields) => {
    if (err) {
      console.log('Unable to insert item at row ', i++);
      return console.log(err);
    }
    console.log(`Row ${i} of ${numRows}`);
  });
};
