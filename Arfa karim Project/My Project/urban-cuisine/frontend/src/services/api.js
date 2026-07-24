import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ── Request interceptor — attach JWT if present ───────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('uc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — normalize errors ───────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expired / invalid — clear storage and redirect to login
    if (error.response?.status === 401) {
      const isAuthRoute =
        error.config.url.includes('/auth/login') ||
        error.config.url.includes('/auth/register');

      if (!isAuthRoute) {
        localStorage.removeItem('uc_token');
        localStorage.removeItem('uc_user');
        window.location.href = '/login';
      }
    }

    // Unwrap the error message from our standard API shape
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';

    return Promise.reject(new Error(message));
  }
);

export default api;
