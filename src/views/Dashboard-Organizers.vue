<template>
  <header>
    <!-- Sidebar -->
    <div :class="['sidebar', { open: isSidebarOpen }]">
  <div class="top">
    <div class="logo">
      <i class="bx bxl-codeopen"></i>
      <span class="title-name" v-show="isSidebarOpen">CommEase</span>
    </div>
    <i class="bx bx-menu" id="btn" @click="toggleSidebar"></i>
  </div>

  <ul>
    <li>
      <router-link to="/DashboardOrganizers">
        <i class="bx bxs-dashboard"></i>
        <span class="nav-item" v-show="isSidebarOpen">Dashboard</span>
      </router-link>
    </li>
    <li>
      <router-link to="/ActivityLogOrganizers">
        <i class="bx bx-history"></i>
        <span class="nav-item" v-show="isSidebarOpen">Event History</span>
      </router-link>
    </li>
    <li>
      <router-link to="SafetyProtocolsOrganizers">
        <i class="bx bxs-shield-plus"></i>
        <span class="nav-item" v-show="isSidebarOpen">Safety & Protocols</span>
      </router-link>
    </li>
    <li @click="toggleNotifications">
      <a>
        <i class="bx bxs-bell"></i>
        <span class="nav-item" v-show="isSidebarOpen">Notifications</span>
      </a>
    </li>
    <li @click="showLogoutModal = true">
      <a>
        <i class="bx bxs-log-out"></i>
        <span class="nav-item" v-show="isSidebarOpen">Logout</span>
      </a>
    </li>
  </ul>
</div>  

    <!-- LOGOUT MODAL -->
  <div v-if="showLogoutModal" class="logout-modal-overlay">
    <div class="logout-modal">
      <h2>Confirm Logout</h2>
      <p>Are you sure you want to log out?</p>
      <div class="logout-modal-buttons">
        <button @click="showLogoutModal = false" class="cancel-btn">Cancel</button>
        <button @click="confirmLogout" class="logout-btn">Logout</button>
      </div>
    </div>
  </div>
  </header>

  <!-- NOTIFICATION PANEL -->
  <div class="notification-panel" :class="{ open: showNotifications }">
    <div class="notification-header">
      <h2>Notifications</h2>
      <i class="bx bx-x close-btn" @click="toggleNotifications"></i>
    </div>
    <div class="notification-list">
      <div class="notification-item" v-for="(notif, index) in notifications" :key="index">
        <h4>Task Completed</h4>
        <p>{{ notif.message }}</p>
        <span class="time">{{ notif.time }}</span>
      </div>
    </div>
  </div>

  <!-- OVERLAY -->
  <div class="overlay" v-if="showNotifications" @click="toggleNotifications"></div>

  <!-- SEARCH BAR -->
  <input v-model="searchQuery" class="input-search-event" type="search" placeholder="Search event..." />
  <hr class="hr-input" />

  <!-- USER INFO -->
  <div class="container">
    <div class="glasscard-container">
      <div class="picture-1">
        <img src="/public/gulapa.jpg" class="picture-person"/>
      </div>
      <div class="glasscard-titles">
        <h1 class="volunteer-name">Hello, Ridley!</h1>
        <h6 class="service-type">Organizers</h6>
      </div>
    </div>

    <div class="glasscard-container">
      <div class="picture-1">
        <img src="/public/gulapa.jpg" class="picture-person"/>
      </div>
      <div class="glasscard-titles">
        <h1 class="volunteer-name">Mon, Mar 27, 2025</h1>
        <h6 class="service-type">40 °C</h6>
      </div>
    </div>
  </div>

  <h1 class="lists-events">CREATED EVENTS</h1>
  <hr class="hr-lists-events" />
  <router-link to="/CreateEventOrganizers" class="button-create-event">Create Event</router-link>

  <!-- EVENTS LIST -->
  <div class="container-events">
    <div v-for="(event, index) in filteredEvents" :key="index" class="container-glasscard-events">
      <div class="container-inputs">
        <h1 class="container-event-title">{{ event.title }}</h1>
        <h6 class="container-event-location">{{ event.location }}</h6>
        <h6 class="container-event-time">{{ event.time }}</h6>
        <h6 class="container-event-date">{{ event.date }}</h6>

        <div class="button">
          <router-link to="/EditEventOrganizers" class="button-edit">Edit</router-link>
          <router-link to="/AnalyticsOrganizers" class="button-enter">Enter</router-link>
        </div>
      </div>
    </div>
  </div>

  
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

// === Sidebar Toggle ===
const isSidebarOpen = ref(true);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// === Vue Router for navigation ===
const router = useRouter();

// === Notifications & Modal ===
const showNotifications = ref(false);
const showLogoutModal = ref(false);

// === Events & Search ===
const searchQuery = ref("");
const notifications = ref([
  { message: "You completed the 'Update website content' task.", time: "2 hours ago" },
  { message: "You completed the 'Clean up drive' task.", time: "3 hours ago" },
  { message: "You completed the 'Meeting with organizers' task.", time: "5 hours ago" }
]);

const events = ref([
  { title: "Clean Up Drive", location: "Barangay East Bajac-Bajac", time: "10:00am - 12:00pm", date: "08/04/2025" },
  { title: "Tree Planting", location: "Barangay West Tapinac", time: "8:00am - 10:00am", date: "09/10/2025" },
  { title: "Feeding Program", location: "Barangay Sta. Rita", time: "2:00pm - 4:00pm", date: "12/15/2025" }
]);

const filteredEvents = computed(() =>
  events.value.filter(event =>
    event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

// === Methods ===
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const confirmLogout = () => {
  router.push("/login"); // Update this if your logout logic is different
};
</script>


<style scoped src="/src/assets/CSS Organizers/dashboard.css"></style>

