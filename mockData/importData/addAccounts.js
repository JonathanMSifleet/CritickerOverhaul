const chunk = require('chunk');
const endpoints = require('./endpoints');
const fetch = require('node-fetch');
const fs = require('fs');

(async () => {
  let accounts = JSON.parse(fs.readFileSync('../../../sharedData/mockAccounts.json'));

  accounts = accounts.map((account) => {
    Object.keys(account).forEach((key) => {
      switch (true) {
        case key === 'memberSince':
          account[key] = { N: account[key] };
          break;
        default:
          account[key] = { S: account[key] };
          break;
      }
    });

    return { PutRequest: { Item: account } };
  });

  const batchAccounts = chunk(accounts, 25);
  const largeBatch = chunk(batchAccounts, 4);

  let i = 1;
  for await (const batch of largeBatch) {
    const importRequests = [];
    batch.forEach((accountBatch) => {
      console.log(`Importing batch ${i} out of ${batchAccounts.length}`);
      i++;

      importRequests.push(fetch(endpoints.ADD_ACCOUNTS, {
        method: 'POST',
        body: JSON.stringify(accountBatch)
      }));
    });

    try {
      await Promise.all(importRequests);
    } catch (error) {
      console.error(error);
    }
  }
})();
