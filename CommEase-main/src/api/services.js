import api from './axios';
import axios from 'axios';

export const ensureCsrfToken = async () => {
    try {
        const response = await axios.get('http://localhost:8000/sanctum/csrf-cookie');
        return response.data;
    } catch (error) {
        console.error('Failed to get CSRF token:', error);
        throw error;
    }
};

export const login = async (email, password) => {
    try {
        // First ensure we have a CSRF token
        await ensureCsrfToken();
        
        // Then make the login request
        const response = await api.post('/auth/login', { 
            email, 
            password 
        });
        return response;
    } catch (error) {
        console.error('Login failed:', error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.status === 401) {
                throw new Error('Invalid email or password. Please check your credentials.');
            } else if (error.response.status === 403) {
                throw new Error('Please verify your email before logging in.');
            } else if (error.response.status === 422) {
                const errors = error.response.data.errors;
                if (errors.email) {
                    throw new Error('Please use your Gordon College email address (@gordoncollege.edu.ph)');
                }
                throw new Error('Invalid input. Please check your credentials.');
            }
        }
        throw error;
    }
};

export const logout = async () => {
    try {
        const response = await api.post('/auth/logout');
        return response.data;
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
};

export const register = async (firstName, middleInitial, lastName, email, password) => {
    try {
        const response = await api.post('/auth/register', { 
            firstName, 
            middleInitial, 
            lastName, 
            email, 
            password 
        });
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
};
