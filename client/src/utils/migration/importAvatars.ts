import * as endpoints from '../../constants/endpoints';

import chunk from 'chunk';
import httpRequest from '../httpRequest';

interface IAvatar {
  avatar: string;
  username: string;
}

const importAvatars = async (avatars: IAvatar[]): Promise<void> => {
  const marshalledAvatars = avatars.map((avatar) => {
    Object.keys(avatar).forEach((key: string) => {
      // @ts-expect-error required for marshalling
      avatar[key] = { S: avatar[key] };
    });

    return { PutRequest: { Item: avatar } };
  });

  const avatarBatch = chunk(marshalledAvatars, 15);
  const largeAvatarBatch = chunk(avatarBatch, 4);

  console.log('Starting import');

  let i = 1;
  for await (const largeBatch of largeAvatarBatch) {
    const importRequests: Promise<any>[] = [];
    largeBatch.forEach((batch) => {
      console.log(`Importing batch ${i} out of ${avatarBatch.length}`);
      i++;
      importRequests.push(httpRequest(endpoints.IMPORT_AVATARS, 'POST', undefined, batch));
    });

    try {
      await Promise.all(importRequests);
    } catch (error) {
      console.error(error);
    }
  }

  console.log('Import completed');
};

export default importAvatars;
