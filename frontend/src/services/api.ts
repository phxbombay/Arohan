import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../features/auth/store/authStore';

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().token || localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling 401s (optional)
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Optional: Logout user on token expiry
            // useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default api;
