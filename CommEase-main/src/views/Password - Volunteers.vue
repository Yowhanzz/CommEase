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
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const password = ref(localStorage.getItem('password') || '')
const confirmPassword = ref(localStorage.getItem('confirmPassword') || '')
const router = useRouter()

// Save to localStorage whenever changed
watch([password, confirmPassword], () => {
  localStorage.setItem('password', password.value)
  localStorage.setItem('confirmPassword', confirmPassword.value)
})

// Check if both fields are filled and match
const isPasswordValid = computed(() => {
  return password.value !== '' &&
         confirmPassword.value !== '' &&
         password.value === confirmPassword.value
})

// Handle Next
const handleNext = () => {
  if (!password.value || !confirmPassword.value) {
    alert('Please fill out both fields.')
  } else if (password.value !== confirmPassword.value) {
    alert('Passwords do not match. Please try again.')
  } else {
    alert('Account created!')
    router.push('/LoginVolunteers')
  }
}
</script>

<style scoped src="/src/assets/CSS Files/password.css"></style>
