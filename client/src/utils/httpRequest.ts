// eslint-disable-next-line @typescript-eslint/no-explicit-any
const httpRequest = async (url: string, method: string, body?: unknown): Promise<any> => {
  const options = body ? { method, body: JSON.stringify(body) } : { method };

  const result = await fetch(url, {
    ...options,
    cache: 'default',
    headers: {
      'Accept-Encoding': 'gzip, br',
      'Content-Type': 'application/json'
    }
  });

  return result.status === 204 ? { statusCode: 204 } : await result.json();
};

export default httpRequest;
