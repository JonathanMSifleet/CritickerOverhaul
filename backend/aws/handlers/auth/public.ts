import IHTTP from '../../shared/interfaces/IHTTP';

export const handler = (): IHTTP => ({
  statusCode: 204,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  }
});
