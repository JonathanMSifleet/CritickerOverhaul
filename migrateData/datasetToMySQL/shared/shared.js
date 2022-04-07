exports.connectionDetails = {
  host: 'mudfoot.doc.stu.mmu.ac.uk',
  port: 6306,
  user: 'sifleetj',
  password: 'Joosderg6',
  database: 'sifleetj'
};

exports.percentRemaining = (numerator, denominator) => {
  console.log(
    `${((numerator / denominator) * 100).toString().substring(0, 4)}% complete`
  );
};

exports.paramQuery = async (connection, whereStatement, params) => {
  return new Promise((resolve, reject) => {
    connection.query(whereStatement, params, (error, results, fields) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });
};

exports.insertRow = async (connection, insertStatement, items, i, numRows) => {
  connection.query(insertStatement, items, (error, results, fields) => {
    if (error) {
      console.log('Unable to insert item at row ', i);
      console.error(error);
    }

    this.percentRemaining(i, numRows);
  });
};

exports.executeSQL = async (asyncQuery, sql, message) => {
  try {
    await asyncQuery(sql);
    console.log(message);
  } catch (e) {
    console.error(e);
  }
};

exports.populateTableFromArray = async (connection, array, type) => {
  const insertStatement = `INSERT INTO ${type} VALUES (null,?)`;
  const numRows = array.length;
  let i = 0;

  console.log(`Inserting ${type}`);

  for await (const item of array) {
    i++;

    await this.insertRow(connection, insertStatement, item, i, numRows);
  }
};

exports.getForeignField = async (
  connection,
  desiredField,
  desiredFieldTable,
  knownField,
  knownFieldValue
) => {
  const whereStatement = `SELECT ${desiredField} FROM ${desiredFieldTable} WHERE ${desiredFieldTable}.${knownField} = ?`;
  const params = [knownFieldValue];

  try {
    const results = await this.paramQuery(connection, whereStatement, params);
    return results[0][desiredField];
  } catch (e) {
    console.error(e);
    return null;
  }
};

exports.getDate = (date) => {
  if (!date) return null;
  if (date.length !== 10) return null;

  date = date.split('-');
  if (date[0].length === 4) {
    date = `${date[0]}-${date[1]}-${date[2]}`;
  } else {
    date = `${date[2]}-${date[1]}-${date[0]}`;
  }

  return Date.parse(date);
};
