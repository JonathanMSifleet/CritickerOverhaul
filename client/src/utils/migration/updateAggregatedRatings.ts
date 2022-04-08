import * as endpoints from '../../constants/endpoints';
import chunk from 'chunk';
import httpRequest from '../httpRequest';

const updateAggregatedRatings = async (usernames: { username: string }[]): Promise<void> => {
  const extractedUsernames = usernames.map((username) => username.username);
  const usernameBatch = chunk(extractedUsernames, 4);

  console.log('Starting import');

  let i = 1;
  for await (const batch of usernameBatch) {
    const updateRequests: any[] = [];
    batch.forEach((username) => {
      console.log(`Updating user ${i} out of ${extractedUsernames.length}`);
      i++;
      updateRequests.push(httpRequest(`${endpoints.AGGREGATE_RATINGS}/${username}`, 'GET'));
    });

    try {
      await Promise.all(updateRequests);
    } catch (error) {
      console.error(error);
    }
  }

  console.log('Import completed');
};

export default updateAggregatedRatings;
