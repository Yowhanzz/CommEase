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
        <input type="email" placeholder="Email" class="input-type">
      </div>

      <div class="input-container">
        <i class='bx bx-lock-alt'></i>
        <input type="password" placeholder="Password" class="input-type">
      </div>

      <div class="button-separation">
      <router-link to="/DashboardOrganizers" class="login-btn">LOGIN</router-link>
    </div>
    </div>
  </div>
</template>

<style scoped src="/src/assets/CSS Organizers/login.css"></style>
