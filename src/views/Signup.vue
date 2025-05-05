<template>
  <div class="container">
    <div class="triangle-fixed">
      <div class="triangle-light-green"></div>
      <div class="triangle-green"></div>
    </div>

    <!-- Left Side (Only Illustration/Image) -->
    <div class="left-side">
      <img src="/public/signup_login.svg" alt="Volunteers Illustration" class="image">
    </div>

    <!-- SIGNUP PART -->
    <div class="signup-container">
      <h1 class="signup-title">Signup Form</h1>
      <p class="signup-paragraph">Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, amet!</p>

      <div class="signup-hiwalay">
        <div class="signup-separation">
          <h5 class="title">First Name</h5>
          <input v-model="firstName" type="text" class="singup-input">

          <h5 class="title">Last Name</h5>
          <input v-model="lastName" type="text" class="singup-input">
        </div>

        <div class="signup-separation">
          <h5 class="title">Middle Initial</h5>
          <input v-model="middleInitial" type="text" class="singup-input">

          <h5 class="title">Program</h5>
          <input v-model="program" type="text" class="singup-input">
        </div>
      </div>  
    </div>
  </div>

  <div class="footer">
    <router-link 
      to="/OTPVolunteers" 
      class="next"
      :class="{ 'disabled-btn': !isFormValid }"
      :disabled="!isFormValid"
      @click.prevent="!isFormValid && $event.preventDefault()"
    >
      Next
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Reactive values
const firstName = ref(localStorage.getItem('firstName') || '')
const lastName = ref(localStorage.getItem('lastName') || '')
const middleInitial = ref(localStorage.getItem('middleInitial') || '')
const program = ref(localStorage.getItem('program') || '')

// Save to localStorage automatically when value changes
watch([firstName, lastName, middleInitial, program], () => {
  localStorage.setItem('firstName', firstName.value)
  localStorage.setItem('lastName', lastName.value)
  localStorage.setItem('middleInitial', middleInitial.value)
  localStorage.setItem('program', program.value)
})

// Validation
const isFormValid = computed(() => {
  return firstName.value && lastName.value && middleInitial.value && program.value
})

</script>

<style src="/src/assets/CSS Files/signup.css"></style>