import * as endpoints from '../../constants/endpoints';

import IRating from './../../../../shared/interfaces/IRating';
import chunk from 'chunk';
import httpRequest from '../httpRequest';

const importGeneratedRatings = async (ratings: IRating[]): Promise<void> => {
  const marshalledRatings = ratings.map((rating) => {
    Object.keys(rating).forEach((key: string) => {
      switch (true) {
        case key === 'imdbID' || key === 'rating' || key === 'imdbID':
          // @ts-expect-error key can be used as index
          rating[key] = { N: rating[key].toString() };
          break;
        default:
          // @ts-expect-error key can be used as index
          rating[key] = { S: rating[key] };
          break;
      }
    });

    // @ts-expect-error required for marshalling
    rating.createdAt = { N: Date.now().toString() };

    return { PutRequest: { Item: rating } };
  });

  const ratingBatch = chunk(marshalledRatings, 25);
  const largeRatingBatch = chunk(ratingBatch, 4);

  console.log('Starting import');

  let i = 1;
  for await (const largeBatch of largeRatingBatch) {
    const importRequests = [] as Promise<any>[];
    largeBatch.forEach((batch) => {
      console.log(`Importing batch ${i} out of ${ratingBatch.length}`);
      i++;
      importRequests.push(httpRequest(endpoints.IMPORT_GENERATED_RATINGS, 'POST', undefined, batch));
    });

    try {
      await Promise.all(importRequests);
    } catch (error) {
      console.error(error);
    }
  }

  console.log('Import completed');
};

export default importGeneratedRatings;
