import * as endpoints from '../../constants/endpoints';

import chunk from 'chunk';
import httpRequest from '../httpRequest';

interface ISQLDirector {
  imdbID: number;
  name: string;
  nameID: number;
}

const migrateDirectors = async (directors: ISQLDirector[]): Promise<void> => {
  const processedDirectors = directors.map((director) => ({
    imdbID: director.imdbID,
    directors: [{ name: director.name, nameID: director.nameID }]
  }));

  let mergedDirectors = [] as any;

  console.log('Processing directors');

  processedDirectors.forEach((director) => {
    const index = mergedDirectors.findIndex(
      (mergedDirector: { imdbID: number }) => mergedDirector.imdbID === director.imdbID
    );

    index === -1 ? mergedDirectors.push(director) : mergedDirectors[index].directors.push(director.directors[0]);
  });

  mergedDirectors = mergedDirectors.map((director: { directors: string }) => {
    director.directors = JSON.stringify(director.directors);
    return director;
  });

  console.log('Finished processing directors');

  const directorUpdateBatch = chunk(mergedDirectors, 4);

  console.log('Importing directors');
  let i = 1;
  for await (const batch of directorUpdateBatch) {
    const updateBatch: any[] = [];
    batch.forEach((director) => {
      updateBatch.push(httpRequest(endpoints.ADD_DIRECTORS, 'PUT', director));
      console.log(`Imported director ${i} out of ${mergedDirectors.length}`);
      i++;
    });

    try {
      await Promise.all(updateBatch);
    } catch (error) {
      console.error(error);
    }
  }

  console.log('Finished importing directors');
};
export default migrateDirectors;
