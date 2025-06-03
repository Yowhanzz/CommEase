<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { authService } from "@/api/services";

const router = useRouter();

const password = ref("");
const confirmPassword = ref("");
const isLoading = ref(false);
const errors = ref({});

const isFormValid = computed(() => {
  return (
    password.value &&
    confirmPassword.value &&
    password.value === confirmPassword.value &&
    password.value.length >= 8 &&
    !errors.value.password &&
    !errors.value.confirmPassword
  );
});

function clearError(field) {
  if (errors.value[field]) {
    errors.value[field] = "";
  }
}

function validatePassword(value) {
  if (value.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(value)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(value)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(value)) {
    return "Password must contain at least one number";
  }
  if (!/[!@#$%^&*]/.test(value)) {
    return "Password must contain at least one special character (!@#$%^&*)";
  }
  return "";
}

async function handleSubmit() {
  // Reset errors
  errors.value = {};

  // Validate password
  const passwordError = validatePassword(password.value);
  if (passwordError) {
    errors.value.password = passwordError;
    return;
  }

  // Validate password confirmation
  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = "Passwords do not match";
    return;
  }

  try {
    isLoading.value = true;
    const email = sessionStorage.getItem("temp_email");

    if (!email) {
      alert("Session expired. Please start password reset again.");
      router.push("/CreateGmailVolunteers");
      return;
    }

    const response = await authService.resetPassword(
      email,
      password.value,
      confirmPassword.value
    );

    if (response) {
      alert("Password reset successful");
      sessionStorage.removeItem("temp_email");
      router.push("/LoginVolunteers");
    }
  } catch (error) {
    console.error("Password reset failed:", error);

    // Handle validation errors from the server
    if (error.response?.status === 422) {
      console.log("Server validation errors:", error.response.data);
      const serverErrors = error.response.data.errors;
      if (serverErrors) {
        // Display the first error message
        const errorMessage = Object.values(serverErrors)[0][0];
        alert(errorMessage);
      } else {
        alert("Password reset failed. Please try again.");
      }
    } else {
      alert("Password reset failed. Please try again.");
    }
  } finally {
    isLoading.value = false;
  }
}
</script>
