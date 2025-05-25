<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { authService } from '../api/services';

export default {
  name: 'Login',
  setup() {
    const email = ref('');
    const password = ref('');

    const handleLogin = async () => {
      try {
        const response = await authService.login({
          email: email.value,
          password: password.value
        });
        console.log('Login successful:', response.data);
        // Handle successful login (e.g., store token, redirect)
      } catch (error) {
        console.error('Login failed:', error);
        // Handle login error
      }
    };

    return {
      email,
      password,
      handleLogin
    };
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style> 