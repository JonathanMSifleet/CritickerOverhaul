import { APIGatewayEvent, Context } from 'aws-lambda';
import IHTTP from '../../interfaces/IHTTP';

export const handler = (event: APIGatewayEvent, context: Context): IHTTP => ({
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  body: JSON.stringify({
    event,
    context
  })
});
