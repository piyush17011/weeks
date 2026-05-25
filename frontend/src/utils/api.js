const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const finalHeaders = { ...defaultHeaders, ...(options.headers || {}) };

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: finalHeaders,
    credentials: options.credentials ?? 'include',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
}

export const api = {
  // Auth
  register:      (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:         (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  me:            ()     => request('/auth/me'),
  updateProfile: (body) => request('/auth/me',       { method: 'PATCH', body: JSON.stringify(body) }),
  logout:        ()     => request('/auth/logout',   { method: 'POST' }),

  // Weeks
  getWeeks:   ()        => request('/weeks'),
  getWeek:    (n)       => request(`/weeks/${n}`),
  saveWeek:   (n, body) => request(`/weeks/${n}`,          { method: 'POST',  body: JSON.stringify(body) }),
  saveDay:    (n, i, b) => request(`/weeks/${n}/day/${i}`, { method: 'PATCH', body: JSON.stringify(b) }),
  searchWeeks:(q)       => request(`/weeks/search/query?q=${encodeURIComponent(q)}`),

  // Milestones
  getMilestones:   ()     => request('/milestones'),
  createMilestone: (body) => request('/milestones',     { method: 'POST',   body: JSON.stringify(body) }),
  deleteMilestone: (id)   => request(`/milestones/${id}`, { method: 'DELETE' }),

  // Analytics
  getOverview:  () => request('/analytics/overview'),
  getMoodTrend: () => request('/analytics/mood-trend'),
};