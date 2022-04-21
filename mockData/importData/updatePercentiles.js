const endpoints = require('./endpoints');
const fetch = require('node-fetch');
const fs = require('fs');

(async () => {
  const usernames = JSON.parse(fs.readFileSync('../sharedData/mockAccounts.json'))
    .map((username) => username.username);
  usernames.push('jonathanmsifleet');

  console.log('Starting updating');

  const importRequests = [];
  usernames.forEach((username) =>
    importRequests.push(fetch(`${endpoints.UPDATE_PERCENTILES}/${username}`, {
      method: 'PUT'
    }))
  );

  try {
    await Promise.all(importRequests);
  } catch (error) {
    console.error(error);
  }

  console.log('Update completed');
})();
