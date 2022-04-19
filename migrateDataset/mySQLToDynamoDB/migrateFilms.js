const chunk = require('chunk');
const endpoints = require('../../mockData/importData/endpoints');
const fetch = require('node-fetch');
const fs = require('fs');

(() => {
  const films = JSON.parse(fs.readFileSync('./filmData.json'));

  const marshalledFilms = films.map((film) => {
    Object.keys(film).forEach((key) => {
      if (film[key] === null) delete film[key];
    });

    Object.keys(film).forEach((key) => {
      switch (true) {
        case key === 'filmDuration' || key === 'releaseYear' || key === 'imdbID':
          film[key] = { N: film[key] };
          break;
        default:
          film[key] = { S: film[key] };
          break;
      }
    });

    return { PutRequest: { Item: film } };
  });

  const filmBatches = chunk(marshalledFilms, 25);

  console.log('Starting import');

  const importRequests = [];
  largeBatch.forEach((batch) => {
    console.log(`Importing batch ${i} out of ${filmBatches.length}`);
    importRequests.push(fetch(endpoints.IMPORT_FILM_BATCH, {
      method:'POST',
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
