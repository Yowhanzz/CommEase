<template>
  <div class="container-separation">

    <div class="triangle-fixed">
      <div class="triangle-light-green"></div>
      <div class="triangle-green"></div>
    </div>

    <!-- Left Side (Only Illustration/Image) -->
    <div class="left-side">
      <img src="/public/signup_login.svg" alt="Volunteers Illustration" class="image">
    </div>

    <!-- OTP PART -->
    <div class="OTP-container">
      <div class="OTP-glasscard">
        <h2 class="OTP-title">OTP Verification</h2>
        <p class="OTP-sentence">Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Modi, asperiores
          eligendi alias necessitatibus quasi repellat.
        </p>

        <div class="OTP-input-separation">
          <input type="number" v-model="otp1" class="input-otp" maxlength="1">
          <input type="number" v-model="otp2" class="input-otp" maxlength="1">
          <input type="number" v-model="otp3" class="input-otp" maxlength="1">
          <input type="number" v-model="otp4" class="input-otp" maxlength="1">
          <input type="number" v-model="otp5" class="input-otp" maxlength="1">
          <input type="number" v-model="otp6" class="input-otp" maxlength="1">
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <router-link to="/CreateGmailVolunteers" class="prev">Previous</router-link>
    
     <!-- Submit button using router-link -->
     <button class="next" @click="handleSubmit">Submit</button>
  </div>
</template>


<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const otp1 = ref(localStorage.getItem('otp1') || '')
const otp2 = ref(localStorage.getItem('otp2') || '')
const otp3 = ref(localStorage.getItem('otp3') || '')
const otp4 = ref(localStorage.getItem('otp4') || '')
const otp5 = ref(localStorage.getItem('otp5') || '')
const otp6 = ref(localStorage.getItem('otp6') || '')

const isOTPComplete = computed(() => {
  return otp1.value && otp2.value && otp3.value && otp4.value && otp5.value && otp6.value
})

watch([otp1, otp2, otp3, otp4, otp5, otp6], () => {
  localStorage.setItem('otp1', otp1.value)
  localStorage.setItem('otp2', otp2.value)
  localStorage.setItem('otp3', otp3.value)
  localStorage.setItem('otp4', otp4.value)
  localStorage.setItem('otp5', otp5.value)
  localStorage.setItem('otp6', otp6.value)
})

function handleSubmit(event) {
  if (!isOTPComplete.value) {
    event.preventDefault() // 🛑 Stop navigation
    alert('Please input your OTP that was given.')
  } else {
    alert('OTP successfully')
    // Optional: clear storage
    localStorage.removeItem('otp1')
    localStorage.removeItem('otp2')
    localStorage.removeItem('otp3')
    localStorage.removeItem('otp4')
    localStorage.removeItem('otp5')
    localStorage.removeItem('otp6')
    // Let navigation continue
    router.push('/FPasswordVolunteers')
  }
}
</script>


<style scoped src="/src/assets/CSS Files/OTP.css"></style>