interface FetchItemOptions {
  method: string;
  body?: unknown;
}

export class FetchError extends Error {
  constructor(public res: Response, message?: string) {
    super(message)
  }
}

export const PUBLIC_API_URL = "http://localhost:5173";

export const fetchItem = async (path: string, options: FetchItemOptions) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };


  const response = await fetch(`${PUBLIC_API_URL}${path}`, {
    method: options.method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new FetchError(response)
  }
};