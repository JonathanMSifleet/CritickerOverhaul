// taken from: https://www.w3schools.com/nodejs/nodejs_mysql_create_db.asp

const mysql = require('mysql2');
const shared = require('./shared/shared');

const connection = mysql.createConnection(shared.connectionDetails);

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');

  connection.query('CREATE DATABASE CritickerOverhaul', (err, result) => {
    if (err) throw err;
    console.log('Database created');
  });
});

export default connection;
