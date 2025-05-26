import api from './axios';
import axios from 'axios';

export const ensureCsrfToken = async () => {
    try {
        const response = await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Failed to get CSRF token:', error);
        throw error;
    }
};

export const authService = {
    async register(userData) {
        try {
            await ensureCsrfToken();
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    },

    async verifyOtp(email, otp) {
        try {
            await ensureCsrfToken();
            const response = await api.post('/auth/verify-otp', { email, otp });
            return response.data;
        } catch (error) {
            console.error('OTP verification failed:', error);
            throw error;
        }
    },

    async createPassword(email, password, confirmPassword) {
        try {
            await ensureCsrfToken();
            const response = await api.post('/auth/create-password', {
                email,
                password,
                confirmPassword
            });
            return response.data;
        } catch (error) {
            console.error('Password creation failed:', error);
            throw error;
        }
    },

    async login(email, password) {
        try {
            await ensureCsrfToken();
            const response = await api.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    async logout() {
        try {
            await ensureCsrfToken();
            const response = await api.post('/auth/logout');
            return response.data;
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    }
};

export const eventService = {
    async createEvent(eventData) {
        try {
            await ensureCsrfToken();
            const response = await api.post('/events', eventData);
            return response;
        } catch (error) {
            if (error.response?.status === 403) {
                throw new Error('You do not have access to this event. Only volunteers from the specified programs can view this event.');
            }
            console.error('Event creation failed:', error);
            throw error;
        }
    },

    async getEvents() {
        try {
            const response = await api.get('/events', {
                params: {
                    include: 'organizer'
                }
            });
            return response;
        } catch (error) {
            if (error.response?.status === 403) {
                throw new Error('You do not have access to these events. Only volunteers from the specified programs can view these events.');
            }
            console.error('Failed to fetch events:', error);
            throw error;
        }
    },

    async getEvent(eventId) {
        try {
            const response = await api.get(`/events/${eventId}`, {
                params: {
                    include: 'organizer'
                }
            });
            return response;
        } catch (error) {
            if (error.response?.status === 403) {
                throw new Error('You do not have access to this event. Only volunteers from the specified programs can view this event.');
            }
            console.error('Failed to get event:', error);
            throw error;
        }
    },

    async updateEvent(eventId, eventData) {
        try {
            await ensureCsrfToken();
            const response = await api.put(`/events/${eventId}`, eventData);
            return response;
        } catch (error) {
            if (error.response?.status === 403) {
                throw new Error('You do not have access to this event. Only volunteers from the specified programs can view this event.');
            }
            console.error('Failed to update event:', error);
            throw error;
        }
    }
};
