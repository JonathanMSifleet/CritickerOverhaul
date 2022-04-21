const chunk = require('chunk');
const endpoints = require('./endpoints');
const fetch = require('node-fetch');
const fs = require('fs');

(async () => {
  const usernamePairs = JSON.parse(fs.readFileSync('../generateData/accounts/generatedPairs.json'));

  console.log('Starting to update TCIs');

  const pairsBatch = chunk(usernamePairs, 100);

  let i = 0;
  for await (const batch of pairsBatch) {
    const requests = [];

    batch.forEach((pair) => {
      requests.push(fetch(`${endpoints.GENERATE_TCI}/${pair}`, {
        method: 'PUT'
      }))
    });

    try {
      await Promise.all(requests);
    } catch (error) {}

    console.log(`Updated ${i} out of ${pairsBatch.length}`);
    i++;
  }
})();
