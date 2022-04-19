const endpoints = require('./endpoints');
const fetch = require('node-fetch');
const fs = require('fs');

const mergePeople = (people, type) => {
  const localMergedPeople = [];

  people.forEach((person) => {
    const index = localMergedPeople.findIndex((mergedPerson) => mergedPerson.imdbID === person.imdbID);

    // @ts-expect-error type can be used as index
    index === -1 ? localMergedPeople.push(person) : localMergedPeople[index][type].push(person[type][0]);
  });

  return localMergedPeople;
};

const convertPersonToArray = (people, type) =>
  people.map((person) => ({
    imdbID: person.imdbID,
    [type]: [{ name: person.name, nameID: person.nameID }]
  }));

const stringifyPeople = (people, type) =>
  people.map((person) => {
    // @ts-expect-error type can be used as index
    person[type] = JSON.stringify(person[type]);
    return person;
  });

(async () => {
  const people = JSON.parse(fs.readFileSync('./directorsData.json'));
  const type = "directors";
  // const people = JSON.parse(fs.readFileSync('./writersData.json'));
  // const type = "writers";
  // const people = JSON.parse(fs.readFileSync('./directorsData.json'));
  // const type = "directors";

  const processedPeople = convertPersonToArray(people, type);

  console.log('Processing people');
  let mergedPeople = mergePeople(processedPeople, type);
  mergedPeople = stringifyPeople(mergedPeople, type);
  console.log('Finished processing people');

  const peopleUpdateBatch = chunk(mergedPeople, 4);

  console.log('Importing people');
  let i = 1;
  for await (const batch of peopleUpdateBatch) {
    const updateBatch = [];
    batch.forEach((person) => {
      updateBatch.push(fetch(`${endpoints.ADD_PEOPLE}/${type}`, {
        method: 'PUT',
        body: JSON.stringify(person)
      }));

      console.log(`Merged person ${i} out of ${mergedPeople.length}`);
      i++;
    });

    try {
      await Promise.all(updateBatch);
    } catch (error) {
      console.error(error);
    }
  }

  console.log('Finished importing people');
})();
