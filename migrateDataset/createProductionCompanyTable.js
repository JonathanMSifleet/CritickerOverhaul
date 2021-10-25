// based on:
// https://www.geeksforgeeks.org/how-to-import-data-from-csv-file-into-mysql-table-using-node-js/

const mysql = require('mysql2');
const csvtojson = require('csvtojson');

const connectionDetails = {
  host: 'localhost',
  user: 'JonathanS',
  password: 'DatasetMigration',
  database: 'critickeroverhaul'
};

const connection = mysql.createConnection(connectionDetails);

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');

  let sql;

  sql = 'DROP TABLE IF EXISTS production_companies';
  executeSQL(sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE production_companies (company_id int NOT NULL AUTO_INCREMENT, company_name VARCHAR(128) UNIQUE, PRIMARY KEY (company_id))';
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
    .fromFile('./datasets/Production_companies.csv')
    .then((source) => {
      // Fetching the data from each row
      // and inserting to the table "sample"

      const numRows = source.length;
      const insertStatement = `INSERT IGNORE INTO production_companies values(null, ?)`;

      for (let i = 0; i < numRows; i++) {
        let company_name = source[i]['company_name'];

        let items = [company_name];

        // Inserting data of current row into database
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
