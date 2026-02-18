import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * Centralized API Client
 * Single axios instance with request/response interceptors
 */

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/v1',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // Important for refresh token cookies
});

/**
 * Request Interceptor
 * Automatically adds authorization header to all requests
 */
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Get token from localStorage (set by auth store)
        const token = localStorage.getItem('token');

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Refresh Token Logic
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

/**
 * Response Interceptor
 * Handles token refresh and error formatting
 */
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const requestUrl = originalRequest.url || '';

        // Skip refresh logic for auth endpoints
        if (requestUrl.includes('/auth/login') ||
            requestUrl.includes('/auth/register') ||
            requestUrl.includes('/auth/verify-otp') ||
            requestUrl.includes('/auth/resend-otp')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                console.warn('🔄 Attempting token refresh. Has refresh token in local storage:', !!refreshToken);

                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
                    { refreshToken }, // Send in body as fallback
                    { withCredentials: true }
                );

                if (data.accessToken) {
                    // Update token in localStorage
                    localStorage.setItem('token', data.accessToken);
                    if (data.refreshToken) {
                        localStorage.setItem('refreshToken', data.refreshToken);
                    }

                    // Process queue
                    processQueue(null, data.accessToken);

                    // Retry original request with new token
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    }
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                // Refresh failed - logout user
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('auth-storage'); // Clear persisted Zustand store

                if (window.location.pathname !== '/signin') {
                    window.location.href = '/signin';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
