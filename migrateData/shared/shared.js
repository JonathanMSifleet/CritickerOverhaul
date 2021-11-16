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

exports.insertRow = async (connection, insertStatement, items, i, numRows) => {
  connection.query(insertStatement, items, (err, results, fields) => {
    if (err) {
      console.log('Unable to insert item at row ', i);
      console.error(err);
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
