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
        src="/public/signup_login.svg"
        alt="Volunteers Illustration"
        class="image"
      />
    </div>

    <!-- Right Side (Login Form) -->
    <div class="login-container">
      <h2 class="title">Welcome Organizers!</h2>

      <div class="input-container">
        <i class="bx bx-envelope"></i>
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="input-type"
          :class="{ error: errors.email }"
          @input="errors.email = ''"
        />
        <span class="error-message" v-if="errors.email">{{
          errors.email
        }}</span>
      </div>

      <div class="input-container">
        <i class="bx bx-lock-alt"></i>
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="input-type"
          :class="{ error: errors.password }"
          @input="errors.password = ''"
        />
        <span class="error-message" v-if="errors.password">{{
          errors.password
        }}</span>
      </div>

      <div class="button-separation">
        <button class="login-btn" @click="handleLogin" :disabled="isLoading">
          {{ isLoading ? "LOGGING IN..." : "LOGIN" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authService } from "../api/services";

const router = useRouter();
const email = ref("");
const password = ref("");
const isLoading = ref(false);
const errors = ref({
  email: "",
  password: "",
});

onMounted(async () => {
  try {
    // Ensure CSRF token exists when reaching login page
    await authService.ensureCsrfToken();
  } catch (error) {
    console.error("Failed to get CSRF token:", error);
    alert("Failed to initialize login. Please refresh the page.");
  }
});

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const handleLogin = async () => {
  // Reset errors
  errors.value = {
    email: "",
    password: "",
  };

  // Validate inputs
  if (!email.value.trim()) {
    errors.value.email = "Email is required";
    return;
  }
  if (!validateEmail(email.value)) {
    errors.value.email = "Please enter a valid email address";
    return;
  }
  if (!password.value.trim()) {
    errors.value.password = "Password is required";
    return;
  }

  isLoading.value = true;

  try {
    const response = await authService.login(email.value, password.value);
    console.log("Login successful:", response);

    // Check if user is an organizer
    if (response.user && response.user.role === "organizer") {
      router.push("/DashboardOrganizers");
    } else {
      alert("Access denied. This login is for organizers only.");
      await authService.logout(); // Logout if not an organizer
    }
  } catch (error) {
    console.error("Login failed:", error);
    if (error.response?.status === 419) {
      alert("Session expired. Please try logging in again.");
    } else if (error.response?.status === 401) {
      alert("Invalid email or password. Please check your credentials.");
    } else if (error.response?.status === 403) {
      alert("Please verify your email before logging in.");
    } else {
      alert("Login failed. Please check your credentials and try again.");
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.error-message {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
}

.input-type.error {
  border-color: #dc3545;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>

<style scoped src="/src/assets/CSS Organizers/login.css"></style>
