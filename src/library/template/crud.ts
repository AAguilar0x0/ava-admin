import { error } from '@sveltejs/kit';

type SveltekitFetch = (
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) => Promise<Response>;

export const handleResponse = async (callback: () => Promise<Response>) => {
  try {
    const result = await callback();
    return new Response(await result.text(), {
      status: result.status,
      statusText: result.statusText
    });
  } catch (err) {
    throw error(500, (err as Error).message);
  }
};

export const post = async (fetch: SveltekitFetch, endpoint: string, rawBody: string) => {
  return handleResponse(async () => {
    return await fetch(`${endpoint}`, {
      method: 'POST',
      body: rawBody.length == 0 ? '{}' : rawBody,
      headers: {
        'content-type': 'application/json'
      }
    });
  });
};

export const getAll = async (fetch: SveltekitFetch, endpoint: string) => {
  return handleResponse(async () => {
    return await fetch(`${endpoint}`);
  });
};

export const getOne = async (fetch: SveltekitFetch, endpoint: string, id: string) => {
  return handleResponse(async () => {
    return await fetch(`${endpoint}/${id}`);
  });
};

export const put = async (fetch: SveltekitFetch, endpoint: string, id: string, rawBody: string) => {
  return handleResponse(async () => {
    return await fetch(`${endpoint}/${id}`, {
      method: 'PUT',
      body: rawBody.length == 0 ? '{}' : rawBody,
      headers: {
        'content-type': 'application/json'
      }
    });
  });
};

export const del = async (fetch: SveltekitFetch, endpoint: string, id: string) => {
  return handleResponse(async () => {
    return await fetch(`${endpoint}/${id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      }
    });
  });
};
