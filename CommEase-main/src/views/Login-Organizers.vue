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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ensureCsrfToken, login } from '../api/services'

const email = ref('')
const password = ref('')
const router = useRouter()
const isLoading = ref(false)

onMounted(async () => {
    await ensureCsrfToken();
});

async function handleLogin() {
    if (!email.value.trim() || !password.value.trim()) {
        alert('Please fill in both email and password.')
        return
    }

    // Validate email format
    if (!email.value.endsWith('@gordoncollege.edu.ph')) {
        alert('Please use your Gordon College email address (@gordoncollege.edu.ph)')
        return
    }

    try {
        const response = await login(email.value, password.value)

        const userData = response.data.user
        const userRole = userData.role

        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('role', userRole)

        if (userRole === 'Volunteer') {
            console.log('You are a volunteer, cannot access this page')
            router.push('/LoginVolunteers')
        } else {
            router.push('/DashboardOrganizers')
        }
    } catch (error) {
        console.error('Login failed:', error)
        alert(error.message || 'Login failed. Please try again.')
    }
}
</script>


<style scoped src="/src/assets/CSS Organizers/login.css"></style>
