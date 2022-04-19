const endpoints = require('./endpoints');
const fetch = require('node-fetch');
const fs = require('fs');

(async () => {
  const accounts = JSON.parse(fs.readFileSync('../generateData/accounts/avatars/avatarPayload.json'));

  console.log('Starting import');

  const importRequests = [];
  accounts.forEach((account, index) => {
    importRequests.push(fetch(`${endpoints.IMPORT_AVATARS}/${account.username}`, {
      method: 'PUT',
      body: JSON.stringify(account.image)
    }));
  });

  try {
    const results = await Promise.all(importRequests);
    console.log("🚀 ~ file: addAvatars.js ~ line 26 ~ results", results)
  } catch (error) {
    console.error(error);
  }

  console.log('Import completed');
})();
