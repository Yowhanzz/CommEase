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
import { authService } from '../api/services'
import { ensureCsrfToken } from '../api/axios'

const email = ref('')
const password = ref('')
const router = useRouter()
const isLoading = ref(false)

onMounted(async () => {
    // Ensure CSRF token exists when reaching login page
    await ensureCsrfToken();
});

async function handleLogin() {
	if (!email.value.trim() || !password.value.trim()) {
		alert('Please fill in both email and password.')
		return
	}

	isLoading.value = true
	try {
		await authService.login({
			email: email.value,
			password: password.value
		})
		
		// Redirect to dashboard
		router.push('/DashboardOrganizers')
	} catch (error) {
		console.error('Login failed:', error)
		if (error.response?.status === 419) {
			alert('Session expired. Please try logging in again.')
		} else {
			alert('Login failed. Please check your credentials and try again.')
		}
	} finally {
		isLoading.value = false
	}
}
</script>


<style scoped src="/src/assets/CSS Organizers/login.css"></style>
