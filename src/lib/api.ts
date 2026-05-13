const API_BASE = import.meta.env.VITE_API_URL || '';

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem('adminToken')
        ? { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  getMenu: () => fetchJson<any[]>('/api/menu'),
  getMenuAll: () => fetchJson<any[]>('/api/menu/all'),
  getCategories: () => fetchJson<string[]>('/api/menu/categories'),
  createMenuItem: (data: any) =>
    fetchJson<any>('/api/menu', { method: 'POST', body: JSON.stringify(data) }),
  updateMenuItem: (id: string, data: any) =>
    fetchJson<any>(`/api/menu/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteMenuItem: (id: string) =>
    fetch(`/api/menu/${id}`, { method: 'DELETE' }).then(r => r.ok),

  login: (email: string, password: string) =>
    fetchJson<{ token: string; email: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      headers: localStorage.getItem('adminToken')
        ? { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
        : {},
      body: formData,
    }).then(async (r) => {
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${r.status}`);
      }
      return r.json();
    });
  },
  getSettings: () => fetchJson<any>('/api/settings'),
  updateSettings: (data: any) =>
    fetchJson<any>('/api/settings', { method: 'PATCH', body: JSON.stringify(data) }),
};
