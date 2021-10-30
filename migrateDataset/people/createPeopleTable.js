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
    'CREATE TABLE people (imdb_name_id MEDIUMINT, ' +
    'person_name VARCHAR(256), PRIMARY KEY (imdb_name_id))';
  await executeSQL(sql);

  sql =
    'SELECT actor_name as person_name FROM critickeroverhaul.actors UNION ' +
    'SELECT director_name as person_name FROM critickeroverhaul.directors UNION ' +
    'SELECT writer_name as person_name FROM critickeroverhaul.writers';

  const results = await executeSQL(sql);

  const names = results.map((row) => row.person_name);

  try {
    await populateTable(names);
  } catch (e) {
    console.error(e);
  }
});

const populateTable = async (names) => {
  let i = 0;

  csvtojson()
    .fromFile('./datasets/IMDb_names.csv')
    .then(async (source) => {
      const numRows = source.length;

      for (let i = 0; i < numRows; i++) {
        let imdb_name_id = source[i]['imdb_name_id'];
        // remove first two characters
        imdb_name_id = imdb_name_id.substring(2, imdb_name_id.length);
        const name = source[i]['name'];

        if (names.includes(name)) {
          try {
            await insertPerson(imdb_name_id, name, i);
          } catch (e) {
            console.error(e);
          }
        }
      }
    });
};

const insertPerson = async (imdb_name_id, name, i) => {
  const insertStatement = `INSERT INTO people (imdb_name_id, person_name) VALUES ('${imdb_name_id}', '${name}')`;

  try {
    await query(insertStatement);
    console.log(`Row ${i} inserted`);
  } catch (e) {
    console.error(e);
  }
};

const executeSQL = async (sql) => {
  try {
    return await query(sql);
  } catch (e) {
    console.error(e);
  }
};
