// based on:
// https://www.geeksforgeeks.org/how-to-import-data-from-csv-file-into-mysql-table-using-node-js/

const mysql = require('mysql2');
const csvtojson = require('csvtojson');
const util = require('util');
const { async } = require('regenerator-runtime');

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

  executeSQL('DROP TABLE IF EXISTS pob', 'Table dropped if exists');

  const sql =
    'CREATE TABLE pob (pob_id MEDIUMINT UNSIGNED, place_of_birth VARCHAR(256), ' +
    'PRIMARY KEY (pob_id, place_of_birth))';

  executeSQL(sql, 'Table created');

  const PoBs = await getPoBs();
  console.log(
    '🚀 ~ file: createPlacesOfBirthTable.js ~ line 30 ~ connection.connect ~ PoBs',
    PoBs
  );

  populateTable(PoBs);
});

const executeSQL = async (sql) => {
  try {
    return await query(sql);
  } catch (e) {
    console.error(e);
  }
};

const getPoBs = async () => {
  const placesToReturn = [];

  csvtojson()
    .fromFile('./datasets/Places_of_birth.csv')
    .then(async (source) => {
      for await (const curPlace of source) {
        // curPlace = curPlace.replace("'", "''");

        if (!placesToReturn.includes(curPlace)) {
          placesToReturn.push(curPlace);
        }
      }
    });
  console.log(
    '🚀 ~ file: createPlacesOfBirthTable.js ~ line 65 ~ getPoBs ~ placesToReturn',
    placesToReturn
  );

  return placesToReturn;
};

const populateTable = async (places) => {
  for await (const curPlace of places) {
    executeSQL(
      `INSERT INTO critickeroverhaul.pob VALUES (NULL, '${curPlace}')`
    );
  }
};
