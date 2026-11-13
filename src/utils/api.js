/**
 * Veloura API Client
 * Centralized fetch wrapper for communicating with the Veloura Node/Express backend.
 * Uses Vite development proxy (/api -> http://localhost:5000/api).
 */

const API_BASE = '/api';

export const getAuthToken = () => {
  try {
    return localStorage.getItem('veloura_token');
  } catch {
    return null;
  }
};

export const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('veloura_token', token);
    } else {
      localStorage.removeItem('veloura_token');
    }
  } catch (err) {
    console.error('Failed to update auth token in storage', err);
  }
};

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const token = getAuthToken();
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Stays
  getStays: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All Stays') query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    const qs = query.toString();
    return apiRequest(`/stays${qs ? `?${qs}` : ''}`);
  },
  getStay: (idOrSlug) => apiRequest(`/stays/${idOrSlug}`),
  getCategories: () => apiRequest('/stays/categories'),

  // Auth
  register: (payload) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  login: (payload) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getMe: () => apiRequest('/auth/me'),
  updateMe: (payload) => apiRequest('/auth/me', {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),

  // Bookings & Payments
  createBooking: (payload) => apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  simulatePayment: (payload) => apiRequest('/bookings/simulate-payment', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  verifyPayment: (payload) => apiRequest('/bookings/simulate-payment', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getMyBookings: (email) => {
    const qs = email ? `?email=${encodeURIComponent(email)}` : '';
    return apiRequest(`/bookings/my${qs}`);
  },
  getBooking: (reference) => apiRequest(`/bookings/${reference}`),
  cancelBooking: (reference) => apiRequest(`/bookings/${reference}/cancel`, {
    method: 'PATCH'
  }),

  // Health
  checkHealth: () => apiRequest('/health')
};

export default api;

