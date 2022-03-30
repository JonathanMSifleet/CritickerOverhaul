import IAccessToken from '../../../shared/interfaces/IAccessToken';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const httpRequest = async (
  url: string,
  method: string,
  requiresAuth: boolean,
  accessToken?: IAccessToken,
  body?: unknown
): Promise<any> => {
  try {
    const options = body ? { method, body: JSON.stringify(body) } : { method };

    let headers = {
      'Accept-Encoding': 'gzip, br',
      'Content-Type': 'application/json'
    } as { [key: string]: string };

    if (requiresAuth) {
      headers = { ...headers, Authorization: `Bearer ${accessToken?.accessToken}` };
    }

    console.log('🚀 ~ file: httpRequest.ts ~ line 17 ~ httpRequest ~ headers', headers);

    const result = await fetch(url, {
      ...options,
      cache: 'default',
      headers
    });

    return result.status === 204 ? { statusCode: 204 } : await result.json();
  } catch (error) {
    console.error(error);
  }
};

export default httpRequest;
