<template>
  <div class="container">
    <div class="triangle-fixed">
      <div class="triangle-light-green"></div>
      <div class="triangle-green"></div>
    </div>

    <!-- Left Side (Only Illustration/Image) -->
    <div class="left-side">
      <img src="/public/signup_login.svg" alt="Volunteers Illustration" class="image">
    </div>

    <!-- FORGOT PASSWORD PART -->
    <div class="signup-container">
      <h1 class="signup-title">Forgot Password</h1>
      <p class="signup-paragraph">Enter your email address to reset your password.</p>

      <div class="signup-hiwalay">
        <div class="signup-separation">
          <h5 class="title">Email Address <span class="required">*</span></h5>
          <input 
            v-model="email" 
            type="email" 
            class="singup-input"
            :class="{ 'error': errors.email }"
            @input="clearError('email')"
            placeholder="Enter your email address"
          >
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>
      </div>  
    </div>
  </div>

  <div class="footer">
    <router-link to="/LoginVolunteers" class="prev">Back</router-link>
    <button 
      class="next"
      :class="{ 'disabled-btn': !isFormValid || isLoading }"
      :disabled="!isFormValid || isLoading"
      @click="handleSubmit"
    >
      {{ isLoading ? 'Processing...' : 'Next' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

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

        // Placeholder for the removed authService
        // Replace with actual implementation
        const response = { status: 200 } // Placeholder response

        console.log('Forgot password response:', response)

        if (response.status === 200) {
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

<style scoped>
.required {
    color: red;
    margin-left: 4px;
}

.error {
    border-color: red !important;
}

.error-message {
    color: red;
    font-size: 0.8rem;
    margin-top: 4px;
    display: block;
}

.disabled-btn {
    opacity: 0.7;
    cursor: not-allowed;
}
</style>

<style scoped src="/src/assets/CSS Files/Create-gmail.css"></style>