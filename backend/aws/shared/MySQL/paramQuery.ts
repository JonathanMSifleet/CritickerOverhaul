import mysql from 'mysql2';

const paramQuery = async (
  connection: mysql.Connection,
  whereStatement: string,
  params: string[] | null
) => {
  return new Promise((resolve, reject) => {
    connection.query(whereStatement, params, (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

export default paramQuery;
