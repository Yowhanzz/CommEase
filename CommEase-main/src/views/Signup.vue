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

    <!-- SIGNUP PART -->
    <div class="signup-container">
      <h1 class="signup-title">Signup Form</h1>
      <p class="signup-paragraph">Please fill in all required fields to create your account.</p>

      <div class="signup-hiwalay">
        <div class="signup-separation">
          <h5 class="title">First Name <span class="required">*</span></h5>
          <input 
            v-model="firstName" 
            type="text" 
            class="singup-input"
            :class="{ 'error': errors.firstName }"
            @input="clearError('firstName')"
          >
          <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>

          <h5 class="title">Last Name <span class="required">*</span></h5>
          <input 
            v-model="lastName" 
            type="text" 
            class="singup-input"
            :class="{ 'error': errors.lastName }"
            @input="clearError('lastName')"
          >
          <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
        </div>

        <div class="signup-separation">
          <h5 class="title">Middle Initial <span class="required">*</span></h5>
          <input 
            v-model="middleInitial" 
            type="text" 
            class="singup-input"
            :class="{ 'error': errors.middleInitial }"
            @input="clearError('middleInitial')"
            maxlength="1"
          >
          <span v-if="errors.middleInitial" class="error-message">{{ errors.middleInitial }}</span>

          <h5 class="title">Program <span class="required">*</span></h5>
          <input 
            v-model="program" 
            type="text" 
            class="singup-input"
            :class="{ 'error': errors.program }"
            @input="clearError('program')"
          >
          <span v-if="errors.program" class="error-message">{{ errors.program }}</span>
        </div>

        <div class="signup-separation">
          <h5 class="title">Email <span class="required">*</span></h5>
          <input 
            v-model="email" 
            type="email" 
            class="singup-input"
            :class="{ 'error': errors.email }"
            @input="clearError('email')"
          >
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>
      </div>  
    </div>
  </div>

  <div class="footer">
    <button 
      class="next"
      :class="{ 'disabled-btn': !isFormValid || isLoading }"
      :disabled="!isFormValid || isLoading"
      @click="handleRegister"
    >
      {{ isLoading ? 'Processing...' : 'Next' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../api/services'

const router = useRouter()

// Reactive values
const firstName = ref('')
const lastName = ref('')
const middleInitial = ref('')
const program = ref('')
const email = ref('')
const isLoading = ref(false)
const errors = ref({
    firstName: '',
    lastName: '',
    middleInitial: '',
    program: '',
    email: ''
})

// Validation
const isFormValid = computed(() => {
    return firstName.value.trim() && 
           lastName.value.trim() && 
           middleInitial.value.trim() && 
           program.value.trim() && 
           email.value.trim() &&
           !Object.values(errors.value).some(error => error !== '')
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

// Handle registration
const handleRegister = async () => {
    // Reset errors
    errors.value = {
        firstName: '',
        lastName: '',
        middleInitial: '',
        program: '',
        email: ''
    }

    // Validate all fields
    if (!firstName.value.trim()) {
        errors.value.firstName = 'First name is required'
    }
    if (!lastName.value.trim()) {
        errors.value.lastName = 'Last name is required'
    }
    if (!middleInitial.value.trim()) {
        errors.value.middleInitial = 'Middle initial is required'
    }
    if (!program.value.trim()) {
        errors.value.program = 'Program is required'
    }
    if (!email.value.trim()) {
        errors.value.email = 'Email is required'
    } else if (!validateEmail(email.value)) {
        errors.value.email = 'Please enter a valid email address'
    }

    // If there are any errors, don't proceed
    if (Object.values(errors.value).some(error => error !== '')) {
        return
    }

    isLoading.value = true

    try {
        console.log('Sending registration data:', {
            firstName: firstName.value.trim(),
            lastName: lastName.value.trim(),
            middleInitial: middleInitial.value.trim(),
            program: program.value.trim(),
            email: email.value.trim()
        })

        const response = await authService.register({
            firstName: firstName.value.trim(),
            lastName: lastName.value.trim(),
            middleInitial: middleInitial.value.trim(),
            program: program.value.trim(),
            email: email.value.trim()
        })

        // Store email for OTP verification
        sessionStorage.setItem('temp_email', email.value.trim())
        
        // Redirect to OTP verification
        router.push('/OTPVolunteers')
    } catch (error) {
        console.error('Signup failed:', error)
        
        // Handle validation errors from the server
        if (error.response?.status === 422) {
            console.log('Server validation errors:', error.response.data)
            const serverErrors = error.response.data.errors
            if (serverErrors) {
                Object.keys(serverErrors).forEach(key => {
                    console.log(`Server error for ${key}:`, serverErrors[key])
                    if (errors.value.hasOwnProperty(key)) {
                        errors.value[key] = serverErrors[key][0]
                    }
                })
            }
        } else {
            alert('Signup failed. Please try again.')
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

<style scoped src="/src/assets/CSS Files/signup.css"></style>