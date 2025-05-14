<template>
  <div class="whole-container">
    
    <!-- Fixed Triangles (NEW wrapper) -->
    <div class="triangle-fixed">
      <div class="triangle-light-green"></div>
      <div class="triangle-green"></div>
    </div>

    <!-- Left Side (Only Illustration/Image) -->
    <div class="left-side">
      <img src="/public/signup_login.svg" alt="Volunteers Illustration" class="image">
    </div>

    <!-- Right Side (Login Form) -->
    <div class="login-container">
    <h2 class="title">Welcome Organizers!</h2>

    <div class="input-container">
      <i class='bx bx-envelope'></i>
      <input v-model="email" type="email" placeholder="Email" class="input-type" />
    </div>

    <div class="input-container">
      <i class='bx bx-lock-alt'></i>
      <input v-model="password" type="password" placeholder="Password" class="input-type" />
    </div>

    <div class="button-separation">
      <button class="login-btn" @click="handleLogin">LOGIN</button>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = () => {
  if (!email.value.trim() || !password.value.trim()) {
    alert('Please enter both email and password.')
    return
  }

  // All good, proceed to organizer dashboard
  router.push('/DashboardOrganizers')
}
</script>


<style scoped src="/src/assets/CSS Organizers/login.css"></style>
