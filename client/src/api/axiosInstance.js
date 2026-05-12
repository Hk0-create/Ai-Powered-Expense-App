import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

// Main API instance (has interceptors attached)
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Separate instance ONLY for refresh calls - NO interceptors ever attached
// This prevents the infinite loop: refresh failure → intercept → refresh → ...
export const refreshApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const setupInterceptors = (getAccessToken, setAccessToken, logout) => {
  // Request Interceptor: Attach access token from memory
  api.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor: Handle silent refresh on 401
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Only attempt refresh once, and never on the refresh endpoint itself
      if (
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          // Use the clean refreshApi instance - NOT the intercepted `api`
          const { data } = await refreshApi.post('/auth/refresh');
          const newAccessToken = data.data.accessToken;

          setAccessToken(newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest); // Retry original request with new token
        } catch (refreshError) {
          // Refresh token is expired/invalid - force logout
          setAccessToken(null);
          logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default api;
