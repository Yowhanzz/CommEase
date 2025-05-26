<template>
  <div class="container">
    <div class="triangle-fixed">
      <div class="triangle-light-green"></div>
      <div class="triangle-green"></div>
    </div>

    <!-- Left Side (Only Illustration/Image) -->
    <div class="left-side">
      <img src="/public/signup_login.svg" alt="Volunteers Illustration" class="image" />
    </div>

    <!-- SIGNUP PART -->
    <div class="signup-container">
      <h1 class="signup-title">Signup Form</h1>
      <p class="signup-paragraph">Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, amet!</p>

      <div class="signup-hiwalay">
        <div class="signup-separation">
          <h5 class="title">Create Password</h5>
          <input v-model="password" type="password" class="singup-input" />

          <h5 class="title">Confirm Password</h5>
          <input v-model="confirmPassword" type="password" class="singup-input" />
        </div>
      </div>    
    </div>

    <!-- Footer -->
    <div class="footer">  
      <router-link to="/OTPVolunteers" class="prev">Previous</router-link>
      <button 
        class="next" 
        :disabled="!isPasswordValid"
        :class="{ 'disabled-btn': !isPasswordValid }"
        @click="handleNext">
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const password = ref('')
const confirmPassword = ref('')
const router = useRouter()

// Check if both fields are filled and match
const isPasswordValid = computed(() => {
    return password.value !== '' &&
           confirmPassword.value !== '' &&
           password.value === confirmPassword.value
})

// Handle Next
const handleNext = async () => {
    if (!password.value || !confirmPassword.value) {
        alert('Please fill out both fields.')
        return
    }
    
    if (password.value !== confirmPassword.value) {
        alert('Passwords do not match. Please try again.')
        return
    }

    // Password validation
    if (password.value.length < 8) {
        alert('Password must be at least 8 characters long.')
        return
    }

    try {
        const email = sessionStorage.getItem('temp_email')
        
        if (!email) {
            alert('Session expired. Please start registration again.')
            router.push('/signup')
            return
        }

        console.log('Sending password creation data:', {
            email,
            password: password.value,
            confirmPassword: confirmPassword.value
        })

        const response = await authService.createPassword({
            email,
            password: password.value,
            confirmPassword: confirmPassword.value
        })

        console.log('Password creation response:', response)

        if (response.status === 200) {
            alert('Account created successfully!')
            // Clear temporary session data
            sessionStorage.removeItem('temp_email')
            router.push('/LoginVolunteers')
        } else {
            throw new Error('Password creation failed')
        }
    } catch (error) {
        console.error('Password creation failed:', error)
        
        // Handle validation errors from the server
        if (error.response?.status === 422) {
            console.log('Server validation errors:', error.response.data)
            const serverErrors = error.response.data.errors
            if (serverErrors) {
                // Display the first error message
                const errorMessage = Object.values(serverErrors)[0][0]
                alert(errorMessage)
            } else {
                alert('Invalid password. Please try again.')
            }
        } else {
            alert('Failed to create account. Please try again.')
        }
    }
}
</script>

<style scoped src="/src/assets/CSS Files/password.css"></style>
