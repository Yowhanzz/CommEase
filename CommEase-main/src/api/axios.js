import axios from 'axios';

// Create axios instance with default config
export const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Add request interceptor to include CSRF token
api.interceptors.request.use(async config => {
    // Get CSRF token from cookie
    const token = document.cookie.split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];

    if (!token) {
        // If no token exists, get a new one
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
            withCredentials: true
        });
        // Get the new token
        const newToken = document.cookie.split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];
        if (newToken) {
            config.headers['X-XSRF-TOKEN'] = decodeURIComponent(newToken);
        }
    } else {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }

    return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 419) {
            // If we get a 419, try to refresh the CSRF token
            return axios.get('http://localhost:8000/sanctum/csrf-cookie', {
                withCredentials: true
            }).then(() => {
                // Retry the original request
                return api(error.config);
            });
        }
        return Promise.reject(error);
    }
);

export default api;