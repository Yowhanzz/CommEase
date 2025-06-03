<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { authService } from "@/api/services";

const router = useRouter();

// Refs for OTP values
const otp1 = ref(localStorage.getItem("otp1") || "");
const otp2 = ref(localStorage.getItem("otp2") || "");
const otp3 = ref(localStorage.getItem("otp3") || "");
const otp4 = ref(localStorage.getItem("otp4") || "");
const otp5 = ref(localStorage.getItem("otp5") || "");
const otp6 = ref(localStorage.getItem("otp6") || "");
const otpFields = [otp1, otp2, otp3, otp4, otp5, otp6];

// Watcher to save OTP input to localStorage
watch(otpFields, () => {
  otpFields.forEach((otp, index) => {
    localStorage.setItem(`otp${index + 1}`, otp.value);
  });
});

// Check if all OTP inputs are filled
const isOTPComplete = computed(() => otpFields.every((otp) => otp.value));

// Input only one digit, auto move next
function onOTPInput(event, index) {
  const value = event.target.value;
  if (/^\d$/.test(value)) {
    otpFields[index].value = value;
    if (index < 5) {
      const nextInput = event.target.nextElementSibling;
      if (nextInput) {
        nextInput.focus();
      }
    }
  } else {
    otpFields[index].value = "";
  }
}

// Go to previous input if backspace and field is empty
function onBackspace(event, index) {
  if (event.key === "Backspace" && !otpFields[index].value && index > 0) {
    const previousInput = event.target.previousElementSibling;
    if (previousInput) {
      previousInput.focus();
    }
  }
}

// On submit
async function handleSubmit(event) {
  if (!isOTPComplete.value) {
    event.preventDefault();
    alert("Please input your OTP that was given.");
    return;
  }

  try {
    const otp = otpFields.map((field) => field.value).join("");
    const email = sessionStorage.getItem("temp_email");

    if (!email) {
      alert("Session expired. Please start password reset again.");
      router.push("/CreateGmailVolunteers");
      return;
    }

    console.log("Sending OTP verification data:", {
      email,
      otp,
    });

    const response = await authService.verifyResetOtp(email, otp);

    console.log("OTP verification response:", response);

    if (response) {
      alert("OTP verified successfully");
      // Clear OTP from localStorage
      otpFields.forEach((_, index) =>
        localStorage.removeItem(`otp${index + 1}`)
      );
      router.push("/FPasswordVolunteers");
    } else {
      throw new Error("OTP verification failed");
    }
  } catch (error) {
    console.error("OTP verification failed:", error);

    // Handle validation errors from the server
    if (error.response?.status === 422) {
      console.log("Server validation errors:", error.response.data);
      const serverErrors = error.response.data.errors;
      if (serverErrors) {
        // Display the first error message
        const errorMessage = Object.values(serverErrors)[0][0];
        alert(errorMessage);
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } else {
      alert("OTP verification failed. Please try again.");
    }
  }
}
</script>
