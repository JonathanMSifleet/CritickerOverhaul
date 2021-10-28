// taken from: https://www.w3schools.com/nodejs/nodejs_mysql_create_db.asp
// and

var mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'JonathanS',
  password: 'DatasetMigration'
});

connection.connect(function (err) {
  if (err) throw err;
  console.log('Connected!');
  connection.query('CREATE DATABASE CritickerOverhaul', function (err, result) {
    if (err) throw err;
    console.log('Database created');
  });
});

export default connection;
