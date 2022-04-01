import * as endpoints from '../../constants/endpoints';

import chunk from 'chunk';
import httpRequest from '../httpRequest';

interface IAccount {
  email: string;
  memberSince: string;
  password: string;
  username: string;
}

const addAccounts = async (accounts: IAccount[]): Promise<void> => {
  const marshalledAccounts = accounts.map((account) => {
    Object.keys(account).forEach((key: string) => {
      switch (true) {
        case key === 'memberSince':
          // @ts-expect-error key can be used to index account
          account[key] = { N: account[key] };
          break;
        default:
          // @ts-expect-error key can be used to index account
          account[key] = { S: account[key] };
          break;
      }
    });

    return { PutRequest: { Item: account } };
  });

  const batchAccounts = chunk(marshalledAccounts, 25);
  const largeBatch = chunk(batchAccounts, 4);

  let i = 1;
  for await (const batch of largeBatch) {
    const importRequests = [] as Promise<any>[];
    batch.forEach((accountBatch) => {
      console.log(`Importing batch ${i} out of ${batchAccounts.length}`);
      i++;
      importRequests.push(httpRequest(endpoints.ADD_ACCOUNTS, 'POST', undefined, accountBatch));
    });

    try {
      await Promise.all(importRequests);
    } catch (error) {
      console.error(error);
    }
  }
};

export default addAccounts;
