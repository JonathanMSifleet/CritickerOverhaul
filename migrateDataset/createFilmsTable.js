const mysql = require('mysql2');
// const csvToRead = require('./datasets/IMDb_movies_usable_no_inline_commas.csv');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'JonathanS',
  password: 'DatasetMigration',
  database: 'CritickerOverhaul'
});

// column names:
// imdb_title_id	title	year	genre	duration country	language
// director	writer	production_company	actors	description	avg_vote	votes

// fields without inline-commas are:
// imdb_title_id	title	year duration
// production_company	description	avg_vote	votes

connection.connect(function (err) {
  if (err) throw err;
  console.log('Connected to database');

  let sql;

  sql = 'DROP TABLE IF EXISTS films';
  executeSQL(sql, 'Table dropped if exists');

  sql =
    'CREATE TABLE films (imdb_title_id VARCHAR(11), title VARCHAR(128), ' +
    'year SMALLINT, duration SMALLINT, production_company VARCHAR(128), ' +
    'description VARCHAR(512), avg_vote FLOAT(1), votes INT, PRIMARY KEY (imdb_title_id))';
  executeSQL(sql, 'Table created');

  // attempt to insert data:
  // 

});

const executeSQL = (sql, message) => {
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(message);
  });
};
