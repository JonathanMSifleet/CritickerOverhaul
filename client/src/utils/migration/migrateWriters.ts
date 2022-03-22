import * as endpoints from '../../constants/endpoints';

import chunk from 'chunk';
import httpRequest from '../httpRequest';

interface ISQLWriter {
  imdbID: number;
  name: string;
  nameID: number;
}

const migrateWriters = async (writers: ISQLWriter[]): Promise<void> => {
  const processedWriters = writers.map((writer) => ({
    imdbID: writer.imdbID,
    writers: [{ name: writer.name, nameID: writer.nameID }]
  }));

  let mergedWriters = [] as any;

  console.log('Processing writers');

  processedWriters.forEach((writer) => {
    const index = mergedWriters.findIndex((mergedWriter: { imdbID: number }) => mergedWriter.imdbID === writer.imdbID);

    index === -1 ? mergedWriters.push(writer) : mergedWriters[index].writers.push(writer.writers[0]);
  });

  mergedWriters = mergedWriters.map((writer: { writers: string }) => {
    writer.writers = JSON.stringify(writer.writers);
    return writer;
  });

  console.log('Finished processing writers');

  const writerUpdateBatch = chunk(mergedWriters, 4);

  console.log('Importing writers');
  let i = 1;
  for await (const batch of writerUpdateBatch) {
    const updateBatch: any[] = [];
    batch.forEach((writer) => {
      updateBatch.push(httpRequest(endpoints.ADD_WRITERS, 'PUT', writer));
      console.log(`Merged writer ${i} out of ${mergedWriters.length}`);
      i++;
    });

    try {
      await Promise.all(updateBatch);
    } catch (error) {
      console.error(error);
    }
  }

  console.log('Finished importing writers');
};
export default migrateWriters;
