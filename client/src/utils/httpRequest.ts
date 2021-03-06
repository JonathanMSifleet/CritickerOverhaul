import IAccessToken from '../../../shared/interfaces/IAccessToken';

interface IHTTPRequest {
  body?: BodyInit;
  headers: {
    [key: string]: string;
  };
  method: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const httpRequest = async (url: string, method: string, accessToken?: IAccessToken, body?: unknown): Promise<any> => {
  const headers: { [key: string]: string } = {
    'Accept-Encoding': 'gzip, br',
    'Content-Type': 'application/json'
  };

  const options: IHTTPRequest = {
    method,
    headers
  };

  if (body) options.body = JSON.stringify(body);
  if (accessToken !== undefined) options.headers = { ...headers, Authorization: `Bearer ${accessToken?.accessToken}` };

  let result: Response;
  try {
    result = await fetch(url, options);
  } finally {
    if (result!.status === 204) return { statusCode: 204 };

    return await result!.json();
  }
};

export default httpRequest;
