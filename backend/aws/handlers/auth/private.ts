import { APIGatewayEvent, Context } from 'aws-lambda';

import IHTTP from '../../shared/interfaces/IHTTP';

export const handler = (event: APIGatewayEvent, context: Context): IHTTP => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      event,
      context
    })
  };
};
