import apiClient from './api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    full_name: string;
    email: string;
    password: string;
    role?: 'patient' | 'doctor' | 'admin';
}

export interface AuthResponse {
    token: string;
    user: {
        user_id: string;
        full_name: string;
        email: string;
        role: string;
    };
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

        // Store token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        return response;
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);

        // Store token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        return response;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    getUser(): AuthResponse['user'] | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },
};
