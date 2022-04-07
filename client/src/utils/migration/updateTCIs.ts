import * as endpoints from '../../constants/endpoints';
import chunk from 'chunk';
import httpRequest from '../httpRequest';

const updateTCIs = async (pairs: { usernamePair: string }[]): Promise<void> => {
  const usernamePairs = pairs.map((pair) => pair.usernamePair);
  const usernamePairBatches = chunk(usernamePairs, 4);

  console.log('Starting to update TCIs');

  let i = 1;

  for await (const batch of usernamePairBatches) {
    const updateTCIRequestBatchs: any[] = [];
    batch.forEach((usernamePair) => {
      console.log(`Updating TCI ${i} out of ${usernamePairs.length}`);
      i++;
      updateTCIRequestBatchs.push(httpRequest(`${endpoints.GENERATE_TCI}/${usernamePair}`, 'POST'));
    });

    try {
      await Promise.all(updateTCIRequestBatchs);
    } catch (error) {
      console.error(error);
    }
  }

  console.log('Updating TCIs complete');
};

export default updateTCIs;
