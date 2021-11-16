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

exports.insertApostropheRow = async (
  connection,
  insertStatement,
  items,
  i,
  numRows
) => {
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
