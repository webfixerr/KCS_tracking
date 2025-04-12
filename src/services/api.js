// src/services/api.js
import axios from 'axios';
import Storage from '../utils/storage';
import { CookieManager } from '../utils/cookies';

// Create base axios instance
const api = axios.create({
  baseURL: 'https://erp.versatractorparts.in/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'User-Agent': 'KCS Mobile App',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Interceptor configuration function
export const configureInterceptors = stores => {
  // Request interceptor
  api.interceptors.request.use(async config => {
    // Add stored token
    const token = Storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add cookies from storage
    const cookies = CookieManager.load();
    if (cookies) {
      config.headers.Cookie = cookies;
    }

    return config;
  });

  // Response interceptor
  api.interceptors.response.use(
    response => {
      // Check for valid JSON response
      if (
        typeof response.data === 'string' &&
        response.data.startsWith('<!DOCTYPE html>')
      ) {
        throw new Error('Server returned HTML instead of JSON');
      }

      if (response.headers['set-cookie']) {
        CookieManager.save(response.headers['set-cookie']);
      }

      stores.app.setLoading(false);

      // Check for HTML responses
      if (
        typeof response.data === 'string' &&
        response.data.includes('<html>')
      ) {
        throw new Error('Invalid API response format');
      }

      return response;
    },
    error => {
      stores.app.setLoading(false);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong';

      // Auto-logout on 401 Unauthorized
      if (error.response?.status === 401) {
        stores.auth.logout();
      }

      // Propagate error unless it's a canceled request
      if (!axios.isCancel(error)) {
        stores.app.setError(errorMessage);
      }

      // Handle undefined response errors
      if (!error.response) {
        error.message = 'Could not connect to server';
      } else if (error.response.status === 401) {
        error.message = 'Session expired - Please login again';
      }

      return Promise.reject(error);
    },
  );
};

export default api;
