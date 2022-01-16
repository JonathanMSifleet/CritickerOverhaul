const HTTPRequest = async (url: string, method: string, body?: unknown): Promise<unknown> => {
  const options = body ? { method, body: JSON.stringify(body) } : { method };

  const result = await fetch(url, options);
  return await result.json();
};

export default HTTPRequest;
