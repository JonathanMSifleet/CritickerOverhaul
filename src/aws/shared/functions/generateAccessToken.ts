import IAccessToken from '../../interfaces/IAccessToken';
import IHTTP from '../../interfaces/IHTTP';
import createAWSResErr from './createAWSResErr';
import fetch from 'node-fetch';

const generateAccessToken = async (): Promise<IAccessToken | IHTTP> => {
  const params = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      audience: process.env.AUTH0_AUDIENCE,
      client_id: process.env.AUTH0_ID,
      client_secret: process.env.AUTH0_PRIVATE_KEY,
      grant_type: 'client_credentials'
    })
  };

  try {
    const results = await fetch(process.env.AUTH0_URL!, params);

    const parsedResults = (await results.json()) as { access_token: string; expires_in: number };
    return {
      accessToken: parsedResults.access_token,
      accessTokenExpiry: Date.now() + parsedResults.expires_in * 1000
    };
  } catch (error) {
    if (error instanceof Error) return createAWSResErr(500, 'Could not create access token');
  }

  return createAWSResErr(500, 'Unhandled Exception');
};

export default generateAccessToken;
