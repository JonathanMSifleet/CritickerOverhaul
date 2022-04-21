const endpoints = require('./endpoints');
const fetch = require('node-fetch');
const fs = require('fs');

(async () => {
  const usernames = JSON.parse(fs.readFileSync('../sharedData/mockAccounts.json')).map((username) => username.username);
  usernames.push('jonathanmsifleet');

  console.log('Starting import');

  const updateRequests = [];
  usernames.forEach((username) => updateRequests.push(
    fetch(`${endpoints.AGGREGATE_PERCENTILES}/${username}`, {
      method: 'PUT'
    })
  ));

  try {
    await Promise.all(updateRequests);
  } catch (error) {
    console.error(error);
  }

  console.log('Import completed');
})();
