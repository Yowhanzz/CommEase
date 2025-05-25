import axios from 'axios';

axios.defaults.withCredentials = true;

// Create axios instance
const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
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
        // Get CSRF token
        const token = getCsrfTokenFromCookie();
        if (!token) {
            await getCsrfCookie();
        }
        
        // Add CSRF token to headers
        config.headers['X-XSRF-TOKEN'] = getCsrfTokenFromCookie();
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response?.status === 419) {
            // CSRF token mismatch, get a new one
            await getCsrfCookie();
            // Retry the original request
            return api(error.config);
        }
        if (error.response?.status === 401) {
            // Handle unauthorized error
            window.location.href = '/LoginOrganizers';
        }
        return Promise.reject(error);
    }
);

export { api as default, getCsrfCookie }; 