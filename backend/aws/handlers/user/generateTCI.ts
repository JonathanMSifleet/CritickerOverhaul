import cors from '@middy/http-cors';
import middy from '@middy/core';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const generateTCI = async (): Promise<void> => {};

export const handler = middy(generateTCI).use(cors());
