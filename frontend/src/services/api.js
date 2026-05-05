const BASE = '/api';

async function request(path, options = {}) {
  const { headers: extraHeaders = {}, ...rest } = options;
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
    ...rest,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

export const api = {
  get:    (path, token) => request(path, { headers: token ? { Authorization: `Bearer ${token}` } : {} }),
  post:   (path, body, token) => request(path, { method: 'POST', body: JSON.stringify(body), headers: token ? { Authorization: `Bearer ${token}` } : {} }),
  put:    (path, body, token) => request(path, { method: 'PUT',  body: JSON.stringify(body), headers: { Authorization: `Bearer ${token}` } }),
  delete: (path, token)       => request(path, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }),
  patch:  (path, body, token) => request(path, { method: 'PATCH', body: JSON.stringify(body), headers: { Authorization: `Bearer ${token}` } }),
};
