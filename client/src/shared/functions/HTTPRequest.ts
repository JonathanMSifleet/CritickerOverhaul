const HTTPRequest = async (url: string, method: string, body?: any) => {
  let options;

  if (body) {
    options = {
      method,
      body: JSON.stringify(body)
    };
  } else {
    options = {
      method
    };
  }

  const result = await fetch(url, options);
  return await result.json();
};

export default HTTPRequest;
