import * as endpoints from '../../constants/endpoints';

import chunk from 'chunk';
import httpRequest from '../httpRequest';

interface ISQLPerson {
  imdbID: number;
  name: string;
  nameID: number;
}

type TPerson = {
  name: string;
  nameID: number;
};

interface IArrayedPerson {
  actors?: TPerson[] | string;
  directors?: TPerson[] | string;
  imdbID: number;
  writers?: TPerson[] | string;
}

const migratePeople = async (people: ISQLPerson[], type: string): Promise<void> => {
  const processedPeople = convertPersonToArray(people, type);

  console.log('Processing people');
  let mergedPeople = mergePeople(processedPeople!, type);
  mergedPeople = stringifyPeople(mergedPeople, type);
  console.log('Finished processing people');

  const peopleUpdateBatch = chunk(mergedPeople, 4);

  console.log('Importing people');
  let i = 1;
  for await (const batch of peopleUpdateBatch) {
    const updateBatch: Promise<any>[] = [];
    batch.forEach((person) => {
      updateBatch.push(httpRequest(`${endpoints.ADD_PEOPLE}/${type}`, 'PUT', undefined, person));
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
};

export default migratePeople;

const mergePeople = (people: IArrayedPerson[], type: string): IArrayedPerson[] => {
  const localMergedPeople: never[] = [];

  people.forEach((person: IArrayedPerson) => {
    const index = localMergedPeople.findIndex(
      (mergedPerson: { imdbID: number }) => mergedPerson.imdbID === person.imdbID
    );

    // @ts-expect-error type can be used as index
    index === -1 ? localMergedPeople.push(person) : localMergedPeople[index][type].push(person[type]![0]);
  });

  return localMergedPeople;
};

const convertPersonToArray = (people: ISQLPerson[], type: string): IArrayedPerson[] =>
  people.map((person) => ({
    imdbID: person.imdbID,
    [type]: [{ name: person.name, nameID: person.nameID }]
  }));

const stringifyPeople = (people: IArrayedPerson[], type: string): IArrayedPerson[] =>
  people.map((person) => {
    // @ts-expect-error type can be used as index
    person[type] = JSON.stringify(person[type]);
    return person;
  });
