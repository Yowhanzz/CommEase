import api, { getCsrfCookie } from './axios';

// Auth Services
export const authService = {
    // Registration
    register: (userData) => api.post('auth/register', userData),
    verifyOtp: (otpData) => api.post('auth/verify-otp', otpData),
    createPassword: (passwordData) => api.post('auth/create-password', passwordData),

    // Login/Logout
    login: async (credentials) => {
        // Get CSRF token before login
        await getCsrfCookie();
        const response = await api.post('auth/login', credentials);
        // Store user data in session storage
        if (response.data.user) {
            sessionStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
    },
    logout: async () => {
        await api.post('auth/logout');
        // Clear session storage
        sessionStorage.removeItem('user');
        // Regenerate CSRF token after logout
        await getCsrfCookie();
    },

    // Password Reset
    forgotPassword: (email) => api.post('auth/forgot-password', { email }),
    verifyResetOtp: (otpData) => api.post('auth/verify-reset-otp', otpData),
    resetPassword: (passwordData) => api.post('auth/reset-password', passwordData),

    // Get current user
    getCurrentUser: () => {
        const user = sessionStorage.getItem('user');
        return user ? Promise.resolve(JSON.parse(user)) : api.get('user');
    }
};

// Event Services
export const eventService = {
    // Get events
    getEvents: (params) => api.get('events', { params }),
    getEvent: (eventId) => api.get(`events/${eventId}`),

    // Organizer routes
    createEvent: (eventData) => api.post('events', eventData),
    updateEvent: (eventId, eventData) => api.put(`events/${eventId}`, eventData),
    deleteEvent: (eventId) => api.delete(`events/${eventId}`),
    startEvent: (eventId) => api.post(`events/${eventId}/start`),
    endEvent: (eventId) => api.post(`events/${eventId}/end`),
    getEventAnalytics: (eventId) => api.get(`events/${eventId}/analytics`),
    markAttendance: (eventId, attendanceData) => api.post(`events/${eventId}/attendance`, attendanceData),
    getAttendance: (eventId) => api.get(`events/${eventId}/attendance`),
    getFeedback: (eventId) => api.get(`events/${eventId}/feedback`),

    // Volunteer routes
    registerForEvent: (eventId) => api.post(`events/${eventId}/register`),
    unregisterFromEvent: (eventId) => api.post(`events/${eventId}/unregister`),
    submitThingsBrought: (eventId, data) => api.post(`events/${eventId}/things-brought`, data),
    submitSuggestion: (eventId, data) => api.post(`events/${eventId}/suggestions`, data),
    getEventHistory: () => api.get('event-history'),
    submitFeedback: (eventId, feedbackData) => api.post(`events/${eventId}/feedback`, feedbackData)
};

// Export all services
export default {
    auth: authService,
    events: eventService
};

export const userService = {
    getProfile: () => api.get('users/profile'),
    updateProfile: (data) => api.put('users/profile', data),
};

// Add more services as needed for your application 