import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.response?.data?.error || 'An unexpected error occurred';
    
    // Handle unauthorized errors (token expiration / invalid credentials)
    if (error.response?.status === 401 || error.response?.status === 403) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/user/login' && currentPath !== '/user/register' && currentPath !== '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        toast.error('Session expired. Please log in again.');
        // Trigger page redirect to login
        setTimeout(() => {
          window.location.href = '/user/login';
        }, 1500);
      }
    } else {
      // Don't show toast for registration conflicts (already handled locally)
      if (error.response?.status !== 409) {
        toast.error(message);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
