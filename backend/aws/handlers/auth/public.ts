import IHTTP from '../../shared/interfaces/IHTTP';

export const handler = (): IHTTP => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      message: 'Hello from Public API'
    })
  };
};
