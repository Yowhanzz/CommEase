<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/api/services'

const router = useRouter()
const email = ref('')
const isLoading = ref(false)
const errors = ref({
    email: ''
})

// Validation
const isFormValid = computed(() => {
    return email.value.trim() && !errors.value.email
})

// Clear error when user types
const clearError = (field) => {
    errors.value[field] = ''
}

// Validate email format
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

// Handle submit
const handleSubmit = async () => {
    // Reset errors
    errors.value = {
        email: ''
    }

    // Validate email
    if (!email.value.trim()) {
        errors.value.email = 'Email is required'
        return
    }
    if (!validateEmail(email.value)) {
        errors.value.email = 'Please enter a valid email address'
        return
    }

    isLoading.value = true

    try {
        console.log('Sending forgot password request:', {
            email: email.value.trim()
        })

        const response = await authService.sendResetOtp(email.value.trim())

        console.log('Forgot password response:', response)

        if (response) {
            // Store email for OTP verification
            sessionStorage.setItem('temp_email', email.value.trim())
            // Redirect to OTP verification
            router.push('/FOTPVolunteers')
        } else {
            throw new Error('Failed to send reset code')
        }
    } catch (error) {
        console.error('Forgot password failed:', error)
        
        // Handle validation errors from the server
        if (error.response?.status === 422) {
            console.log('Server validation errors:', error.response.data)
            const serverErrors = error.response.data.errors
            if (serverErrors) {
                // Display the first error message
                const errorMessage = Object.values(serverErrors)[0][0]
                alert(errorMessage)
            } else {
                alert('Invalid email. Please try again.')
            }
        } else {
            alert('Failed to send reset code. Please try again.')
        }
    } finally {
        isLoading.value = false
    }
}
</script> 