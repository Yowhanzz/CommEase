export const authService = {
    async ensureCsrfToken() {
        try {
            const response = await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Failed to get CSRF token:', error);
            throw error;
        }
    },

    async checkAuth() {
        try {
            const response = await api.get('/auth/check');
            return response.data.authenticated;
        } catch (error) {
            console.error('Auth check failed:', error);
            return false;
        }
    },

    async getUserRole() {
        try {
            const response = await api.get('/auth/user');
            return response.data.role;
        } catch (error) {
            console.error('Failed to get user role:', error);
            return null;
        }
    },

    async register(userData) {
        try {
            await this.ensureCsrfToken();
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    },

    async createPassword(email, password, confirmPassword) {
        try {
            await this.ensureCsrfToken();
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

    async sendResetOtp(email) {
        try {
            await this.ensureCsrfToken();
            const response = await api.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            console.error('Failed to send reset OTP:', error);
            throw error;
        }
    },

    async verifyResetOtp(email, otp) {
        try {
            await this.ensureCsrfToken();
            const response = await api.post('/auth/verify-reset-otp', { email, otp });
            return response.data;
        } catch (error) {
            console.error('Failed to verify reset OTP:', error);
            throw error;
        }
    },

    async resetPassword(email, password, confirmPassword) {
        try {
            await this.ensureCsrfToken();
            const response = await api.post('/auth/reset-password', {
                email,
                password,
                confirmPassword
            });
            return response.data;
        } catch (error) {
            console.error('Failed to reset password:', error);
            throw error;
        }
    }
}; 