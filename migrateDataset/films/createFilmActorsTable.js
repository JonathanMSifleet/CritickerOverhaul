// using the method seen in other create-table scripts causes Node to run out of memory
// the machine I'm using does not have enough RAM required to run the script
// this is caused by using such a large dataset
// instead I will be using an alternative method, i.e. reading each line, one by one

// in other scripts, the headers of the file are not omitted as the package used to read
// the CSV ignores the headers, the current package does not do so, and adding an if statement
// to check if it is the first line of the file is inefficient, as such I have manually removed
// the header row

// this script took over 4 hours to run on my machine

const mysql = require('mysql2');
const util = require('util');
const fs = require('fs');
const byline = require('byline');

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

  await query('DROP TABLE IF EXISTS film_actors');

  sql =
    'CREATE TABLE film_actors (person_id MEDIUMINT, imdb_title_id ' +
    'VARCHAR(11), PRIMARY KEY (person_id, imdb_title_id))';
  await query(sql);

  sql =
    'CREATE INDEX actor_name_index ON critickeroverhaul.actors (actor_name)';

  try {
    const result = await query(sql);
    console.log('result', result);
  } catch (e) {
    console.error(e.sqlMessage);
  }
  try {
    await populateTable();
  } catch (e) {
    console.error(e);
  }
});

const populateTable = async () => {
  const stream = byline(
    fs.createReadStream('./datasets/Film_Actors_no_headers.csv', {
      encoding: 'utf8'
    })
  );

  const totalRows = 85855;
  let i = 0;
  stream.on('data', async (line) => {
    i++;
    let actors;

    if (line.includes('"')) {
      line = line.split(',"');
      // remove speech mark on end of string:
      actors = line[1].slice(0, -1);
      actors = actors.split(', ');
    } else {
      // handle singular actor
      line = line.split(',');
      actors = line[1];
      actors = [actors];
    }

    const imdb_title_id = line[0];
    try {
      await insertActors(actors, imdb_title_id, i);
    } catch (e) {
      console.error(e);
    }
  });
};

const insertActors = async (actors, imdb_title_id, i) => {
  actors.forEach(async (actorName) => {
    const selectStatement =
      'SELECT person_id FROM critickeroverhaul.actors ' +
      `WHERE critickeroverhaul.actors.actor_name = "${actorName}"`;

    let person_id;

    try {
      const rows = await query(selectStatement);
      person_id = rows[0]['person_id'];
    } catch (e) {
      console.error(line, e);
    }

    const insertStatement = `INSERT INTO film_actors (person_id, imdb_title_id) VALUES ('${person_id}', '${imdb_title_id}')`;

    try {
      await query(insertStatement);
    } catch (e) {
      console.error(e);
    } finally {
      console.log(`Row ${i} inserted`);
    }
  });
};
