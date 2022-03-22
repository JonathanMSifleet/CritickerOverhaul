import * as endpoints from '../../constants/endpoints';

import chunk from 'chunk';
import httpRequest from '../httpRequest';

interface ISQLActor {
  imdbID: number;
  name: string;
  nameID: number;
}

const migrateActors = async (actors: ISQLActor[]): Promise<void> => {
  const processedActors = actors.map((actor) => ({
    imdbID: actor.imdbID,
    actors: [{ name: actor.name, nameID: actor.nameID }]
  }));

  let mergedActors = [] as any;

  console.log('Processing actors');

  processedActors.forEach((actor) => {
    const index = mergedActors.findIndex((mergedActor: { imdbID: number }) => mergedActor.imdbID === actor.imdbID);

    index === -1 ? mergedActors.push(actor) : mergedActors[index].actors.push(actor.actors[0]);
  });

  mergedActors = mergedActors.map((actor: { actors: string }) => {
    actor.actors = JSON.stringify(actor.actors);
    return actor;
  });

  console.log('Finished processing actors');

  const actorUpdateBatch = chunk(mergedActors, 4);

  console.log('Importing actors');
  let i = 1;
  for await (const batch of actorUpdateBatch) {
    const updateBatch: any[] = [];
    batch.forEach((actor) => {
      updateBatch.push(httpRequest(endpoints.ADD_ACTORS, 'PUT', actor));
      console.log(`Merged actor ${i} out of ${mergedActors.length}`);
      i++;
    });

    try {
      await Promise.all(updateBatch);
    } catch (error) {
      console.error(error);
    }
  }

  console.log('Finished importing actors');
};
export default migrateActors;
