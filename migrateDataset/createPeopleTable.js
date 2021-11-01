// this scripts swaps back to the original csvtojson package method
// as I got the following error:

// Error: EBUSY: resource busy or locked, read
// Emitted 'error' event on ReadStream instance at:
//     at internal/fs/streams.js:173:14
//     at FSReqCallback.wrapper [as oncomplete] (fs.js:562:5) {
//   errno: -4082,
//   code: 'EBUSY',
//   syscall: 'read'
// }

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

  await executeSQL('DROP TABLE IF EXISTS people');

  let sql =
    'CREATE TABLE people (imdb_name_id MEDIUMINT UNSIGNED, ' +
    'person_name VARCHAR(64), PRIMARY KEY (imdb_name_id))';
  await executeSQL(sql);

  try {
    await populateTable();
  } catch (e) {
    console.error(e);
  }
});

const populateTable = async () => {
  let i = 0;

  csvtojson()
    .fromFile('./datasets/IMDb_names.csv')
    .then(async (source) => {
      const numRows = source.length;

      for (let i = 0; i < numRows; i++) {
        const imdb_name_id = source[i]['imdb_name_id'];
        const name = source[i]['name'];

        try {
          await insertPerson(imdb_name_id, name, i);
        } catch (e) {
          console.error(e);
        }
      }
    });
};

const insertPerson = async (imdb_name_id, name, i) => {
  const insertStatement = `INSERT INTO people (imdb_name_id, person_name) VALUES ('${imdb_name_id}', '${name}')`;

  await executeSQL(insertStatement);
  console.log(`Row ${i} inserted`);
};

const executeSQL = async (sql) => {
  try {
    return await query(sql);
  } catch (e) {
    console.error(e);
  }
};
