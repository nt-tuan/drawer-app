async function request<T>(
  method: string,
  path: string,
  _headers?: HeadersInit,
  body?: string
): Promise<T> {
  const headers = { ..._headers, "Content-Type": "application/json" };
  const response = await fetch(path, { method, headers, body });
  if (response.ok) return response.json();
  const { error } = await response.json();
  throw Error(error);
}

const getAuthHeader = (token?: string) =>
  token ? ({ Authorization: token } as HeadersInit) : {};

export default {
  get: <T>(path: string, token?: string) => {
    return request<T>("GET", path, getAuthHeader(token));
  },
  post: <T>(path: string, token?: string, body?: string) => {
    return request<T>("POST", path, getAuthHeader(token), body);
  },
  delete: <T>(path: string, token?: string, body?: string) => {
    return request<T>("DELETE", path, getAuthHeader(token), body);
  },
};
