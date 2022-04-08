import * as endpoints from '../../constants/endpoints';
import chunk from 'chunk';
import httpRequest from '../httpRequest';

const updatePercentiles = async (usernames: { name: string }[]): Promise<void> => {
  const extractedUsernames = usernames.map((username) => username.name);

  const usernameBatches = chunk(extractedUsernames, 4);

  console.log('Starting updating');

  let i = 1;
  for await (const batch of usernameBatches) {
    const importRequests: Promise<any>[] = [];
    batch.forEach((name) => {
      console.log(`Updating percentiles ${i} out of ${extractedUsernames.length}`);
      i++;
      importRequests.push(httpRequest(`${endpoints.UPDATE_PERCENTILES}/${name}`, 'PUT'));
    });

    try {
      await Promise.all(importRequests);
    } catch (error) {
      console.error(error);
    }
  }

  console.log('Update completed');
};

export default updatePercentiles;
