<template>
	<div class="whole-container">
		<!-- Fixed Triangles (NEW wrapper) -->
		<div class="triangle-fixed">
			<div class="triangle-light-green"></div>
			<div class="triangle-green"></div>
		</div>

		<!-- Left Side (Only Illustration/Image) -->
		<div class="left-side">
			<img
				src="/signup_login.svg"
				alt="Volunteers Illustration"
				class="image"
			/>
		</div>

		<!-- Right Side (Login Form) -->
		<div class="login-container">
			<h2 class="title">Welcome Volunteers!</h2>

			<div class="input-container">
				<i class="bx bx-envelope"></i>
				<input v-model="email" type="email" placeholder="Email" class="input-type" />
			</div>

			<div class="input-container">
				<i class="bx bx-lock-alt"></i>
				<input v-model="password" type="password" placeholder="Password" class="input-type" />
			</div>

			<div class="action-button">
				<button class="login-btn" @click="handleLogin" :disabled="isLoading">LOGIN</button>
				<router-link to="/signup" class="signup-btn">SIGNUP</router-link>
				<router-link to="/CreateGmailVolunteers" class="forgot-password">Forgot Password?</router-link>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ensureCsrfToken } from '../api/services'

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

	const login = async (email, password) => {
		try {
			const response = await api.post('auth/login', {
				email: email,
				password: password,
			})
		} catch (error) {
			console.error('Login failed:', error)
			if (error.response?.status === 419) {
				alert('Session expired. Please try logging in again.')
			} else {
				alert('Login failed. Please check your credentials and try again.')
			}
		}
	}
}
</script>

<style scoped src="/src/assets/CSS Volunteers/login.css"></style>
