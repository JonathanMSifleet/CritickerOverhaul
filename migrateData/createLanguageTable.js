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

  let sql = 'DROP TABLE IF EXISTS languages';
  await shared.executeSQL(asyncQuery, sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE languages (language_id SMALLINT AUTO_INCREMENT, ' +
    'language_name VARCHAR(36) UNIQUE, PRIMARY KEY (language_id))';
  await shared.executeSQL(asyncQuery, sql, 'Table created');

  const languages = await fetchLanguages();
  console.log('Fetched all languages');

  languages.sort();

  await shared.populateTableFromArray(connection, languages, 'languages');
});

const fetchLanguages = async () => {
  const languagesToReturn = [];

  await csvtojson()
    .fromFile('./datasets/Languages.csv')
    .then(async (source) => {
      const numRows = source.length;

      let i = 0;
      for await (const row of source) {
        i++;

        let languages = row.languages;
        languages = languages.split(', ');

        shared.percentRemaining(i, numRows);
        languages.forEach((curLanguage) => {
          if (!languagesToReturn.includes(curLanguage)) {
            languagesToReturn.push(curLanguage);
          }
        });
      }
    });
  return languagesToReturn;
};
