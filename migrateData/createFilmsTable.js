// based on:
// https://www.geeksforgeeks.org/how-to-import-data-from-csv-file-into-mysql-table-using-node-js/

const mysql = require('mysql2');
const csvtojson = require('csvtojson');

const connectionDetails = {
  host: 'mudfoot.doc.stu.mmu.ac.uk',
  port: 6306,
  user: 'sifleetj',
  password: 'Joosderg6',
  database: 'sifleetj'
};

const connection = mysql.createConnection(connectionDetails);

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');

  let sql;

  sql = 'DROP TABLE IF EXISTS films';
  executeSQL(sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE films (imdb_title_id MEDIUMINT UNSIGNED, title VARCHAR(224), ' +
    'year SMALLINT, duration SMALLINT, description VARCHAR(512), ' +
    'PRIMARY KEY (imdb_title_id))';
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
    .fromFile('./datasets/IMDb_movies_usable_no_inline_commas.csv')
    .then(async (source) => {
      // Fetching the data from each row
      // and inserting to the table "sample"

      const numRows = source.length;
      const insertStatement = `INSERT INTO films VALUES (?, ?, ?, ?, ?)`;
      let i = 0;

      for await (const film of source) {
        i++;

        const { imdb_title_id, title, year, duration, description } = film;
        const items = [imdb_title_id, title, year, duration, description];

        // Inserting data of current row into database
        await insertRow(i, numRows, insertStatement, items);
      }
    });
};

const insertRow = async (i, numRows, insertStatement, items) => {
  connection.query(insertStatement, items, (err, results, fields) => {
    if (err) {
      console.log('Unable to insert item at row ', i);
      console.log(err);
    }

    // console.log(`Inserted row ${i} of ${numRows}`);
    console.log(
      `${((i / numRows) * 100).toString().substring(0, 4)}% complete`
    );
  });
};
