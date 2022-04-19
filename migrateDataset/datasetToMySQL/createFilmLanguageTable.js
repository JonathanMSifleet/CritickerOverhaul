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
    'DROP TABLE IF EXISTS film_languages',
    'Table dropped if exists'
  );

  const sql =
    'CREATE TABLE film_languages (imdb_title_id MEDIUMINT UNSIGNED, language_id SMALLINT, ' +
    'PRIMARY KEY (imdb_title_id, language_id), ' +
    'FOREIGN KEY (language_id) REFERENCES languages(language_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE, ' +
    'FOREIGN KEY (imdb_title_id) REFERENCES films(imdb_title_id) ' +
    'ON DELETE CASCADE ON UPDATE CASCADE)';

  await shared.executeSQL(asyncQuery, sql, 'Table created');

  populateTable();
});

const populateTable = async () => {
  await csvtojson()
    .fromFile('./datasets/Film_Languages.csv')
    .then(async (source) => {
      const insertStatement = 'INSERT IGNORE INTO film_languages VALUES (?, ?)';
      const numRows = source.length;

      let i = 0;
      for await (const row of source) {
        i++;

        const languages = row.languages.split(', ');

        for await (const curLanguage of languages) {
          try {
            const language_id = await shared.getForeignField(
              connection,
              'language_id',
              'languages',
              'language_name',
              curLanguage
            );

            const items = [row.imdb_title_id, language_id];

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
