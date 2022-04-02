import IAccessToken from '../../../shared/interfaces/IAccessToken';

interface IHTTPRequest {
  body?: BodyInit;
  headers: {
    [key: string]: string;
  };
  method: string;
}

const httpRequest = async (url: string, method: string, accessToken?: IAccessToken, body?: any): Promise<any> => {
  const headers: { [key: string]: string } = {
    'Accept-Encoding': 'gzip, br',
    'Content-Type': 'application/json'
  };

  const options: IHTTPRequest = {
    method,
    headers
  };

  if (body) options.body = body;

  if (accessToken !== undefined) {
    options.headers = { ...headers, Authorization: `Bearer ${accessToken?.accessToken}` };
    // @ts-expect-error body is object
    if (body) options.body = { ...options.body, accessToken: accessToken!.accessToken };
  }

  if (body) options.body = JSON.stringify(options.body);

  const result = await fetch(url, options);
  return result.status === 204 ? { statusCode: 204 } : await result.json();
};

export default httpRequest;
