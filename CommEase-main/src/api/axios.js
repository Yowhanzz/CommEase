import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true // Required for Sanctum cookie-based authentication
});

// Function to get CSRF token from cookie
const getCsrfTokenFromCookie = () => {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
    
    if (token) {
        return decodeURIComponent(token);
    }
    return null;
};

// Function to fetch CSRF cookie
const getCsrfCookie = async () => {
    try {
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
            withCredentials: true
        });
        return getCsrfTokenFromCookie();
    } catch (error) {
        console.error('Failed to fetch CSRF cookie:', error);
        throw error;
    }
};

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Clear user data and redirect to login
            sessionStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api; 