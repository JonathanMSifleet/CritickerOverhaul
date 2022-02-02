// eslint-disable-next-line @typescript-eslint/no-explicit-any
const httpRequest = async (url: string, method: string, body?: unknown): Promise<any> => {
  const options = body ? { method, body: JSON.stringify(body) } : { method };

  const result = await fetch(url, { ...options, cache: 'force-cache' });
  return await result.json();
};

export default httpRequest;
