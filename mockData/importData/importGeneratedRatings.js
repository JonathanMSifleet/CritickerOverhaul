const chunk = require('chunk')
const endpoints = require('./endpoints');
const fetch = require('node-fetch');
const fs = require('fs');

(async () => {
  const ratings = JSON.parse(fs.readFileSync('../generateData/ratings/generatedRatings.json'));

  const marshalledRatings = ratings.map((rating) => {
    Object.keys(rating).forEach((key) => {
      switch (true) {
        case key === 'imdbID' || key === 'rating' || key === 'imdbID':
          rating[key] = { N: rating[key].toString() };
          break;
        default:
          rating[key] = { S: rating[key] };
          break;
      }
    });

    rating.createdAt = { N: Date.now().toString() };

    return { PutRequest: { Item: rating } };
  });

  const ratingBatch = chunk(marshalledRatings, 25);

  console.log('Starting import');

  const importRequests = [];
  ratingBatch.forEach((batch) => {
    importRequests.push(fetch(endpoints.IMPORT_GENERATED_RATINGS, {
      method: 'POST',
      body: JSON.stringify(batch)
    }));
  });

  try {
    await Promise.all(importRequests);
  } catch (error) {
    console.error(error);
  }

  console.log('Import completed');
})();
