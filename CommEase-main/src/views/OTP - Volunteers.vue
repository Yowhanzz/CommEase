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
        <p class="OTP-sentence">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi, asperiores
          eligendi alias necessitatibus quasi repellat.
        </p>

        <div class="OTP-input-separation">
          <input type="text" v-model="otp1" class="input-otp" maxlength="1" @input="onOTPInput($event, otp1)" @keydown.backspace="onBackspace($event, 0)" pattern="[0-9]*" inputmode="numeric" />
          <input type="text" v-model="otp2" class="input-otp" maxlength="1" @input="onOTPInput($event, otp2)" @keydown.backspace="onBackspace($event, 1)" pattern="[0-9]*" inputmode="numeric" />
          <input type="text" v-model="otp3" class="input-otp" maxlength="1" @input="onOTPInput($event, otp3)" @keydown.backspace="onBackspace($event, 2)" pattern="[0-9]*" inputmode="numeric" />
          <input type="text" v-model="otp4" class="input-otp" maxlength="1" @input="onOTPInput($event, otp4)" @keydown.backspace="onBackspace($event, 3)" pattern="[0-9]*" inputmode="numeric" />
          <input type="text" v-model="otp5" class="input-otp" maxlength="1" @input="onOTPInput($event, otp5)" @keydown.backspace="onBackspace($event, 4)" pattern="[0-9]*" inputmode="numeric" />
          <input type="text" v-model="otp6" class="input-otp" maxlength="1" @input="onOTPInput($event, otp6)" @keydown.backspace="onBackspace($event, 5)" pattern="[0-9]*" inputmode="numeric" />
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <router-link to="/signup" class="prev">Previous</router-link>
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

const otpFields = [otp1, otp2, otp3, otp4, otp5, otp6]

const isOTPComplete = computed(() => {
  return otpFields.every(otp => otp.value)
})

watch(otpFields, () => {
  otpFields.forEach((otp, index) => {
    localStorage.setItem(`otp${index + 1}`, otp.value)
  })
})

function onOTPInput(event, otpRef) {
  const value = event.target.value
  if (/^\d$/.test(value)) {
    otpRef.value = value
    const next = event.target.nextElementSibling
    if (next && next.tagName === 'INPUT') {
      next.focus()
    }
  } else {
    otpRef.value = ''
  }
}

function onBackspace(event, index) {
  if (event.key === 'Backspace' && !otpFields[index].value && index > 0) {
    const previous = event.target.previousElementSibling
    if (previous && previous.tagName === 'INPUT') {
      previous.focus()
    }
  }
}

function handleSubmit(event) {
  if (!isOTPComplete.value) {
    event.preventDefault()
    alert('Please input your OTP that was given.')
  } else {
    alert('OTP successfully')
    otpFields.forEach((_, index) => {
      localStorage.removeItem(`otp${index + 1}`)
    })
    router.push('/PasswordVolunteers')
  }
}
</script>

<style scoped src="/src/assets/CSS Files/OTP.css"></style>
