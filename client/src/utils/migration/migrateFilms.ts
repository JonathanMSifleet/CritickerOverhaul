import * as endpoints from '../../constants/endpoints';

import IUserState from '../../interfaces/IUserState';
import chunk from 'chunk';
import httpRequest from '../httpRequest';

interface ISQLFilm {
  company: string;
  countries: string;
  description: string;
  duration: number;
  genres: string;
  imdbID: number;
  languages: string;
  title: string;
  releaseYear: number;
}

const migrateFilms = async (films: ISQLFilm[], userState: IUserState): Promise<void> => {
  const marshalledFilms = films.map((film: ISQLFilm) => {
    // remove null attributes from film object
    Object.keys(film).forEach((key: string) => {
      // @ts-expect-error key can be used as index
      if (film[key] === null) delete film[key];
    });

    Object.keys(film).forEach((key: string) => {
      switch (true) {
        case key === 'duration' || key === 'releaseYear' || key === 'imdbID':
          // @ts-expect-error key can be used as index
          film[key] = { N: film[key] };
          break;
        default:
          // @ts-expect-error key can be used as index
          film[key] = { S: film[key] };
          break;
      }
    });

    return { PutRequest: { Item: film } };
  });

  const filmBatches = chunk(marshalledFilms, 25);
  // max chrome concurrent connections = 6, use 4 to be safe
  const largeFilmBatches = chunk(filmBatches, 4);

  console.log('Starting import');

  let i = 1;
  for await (const largeBatch of largeFilmBatches) {
    const importRequests = [] as any;
    largeBatch.forEach(async (batch: any) => {
      console.log(`Importing batch ${i} out of ${filmBatches.length}`);
      i++;
      importRequests.push(httpRequest(endpoints.IMPORT_FILM_BATCH, 'POST', userState.accessToken, batch));
    });

    try {
      await Promise.all(importRequests);
    } catch (error) {
      console.error(error);
    }
  }

  console.log('Import completed');
};

export default migrateFilms;
