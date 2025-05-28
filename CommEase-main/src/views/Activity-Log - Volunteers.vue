<template>
  <div>
    <!-- Sidebar -->
    <header>
      <div class="sidebar" :class="{ open: isSidebarOpen }">
        <div class="top">
          <div class="logo">
            <i class="bx bxl-codeopen"></i>
            <span class="title-name" v-show="isSidebarOpen">CommEase</span>
          </div>
          <i class="bx bx-menu" id="btn" @click="toggleSidebar"></i>
        </div>

        <ul>
          <li>
            <router-link to="/DashboardVolunteers">
              <i class="bx bxs-dashboard"></i>
              <span class="nav-item" v-show="isSidebarOpen">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/ActivityLogVolunteers">
              <i class="bx bx-history"></i>
              <span class="nav-item" v-show="isSidebarOpen">Event History</span>
            </router-link>
          </li>
          <li>
            <router-link to="safety_protocol">
              <i class="bx bxs-shield-plus"></i>
              <span class="nav-item" v-show="isSidebarOpen"
                >Safety & Protocols</span
              >
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
            <button @click="showLogoutModal = false" class="cancel-btn">
              Cancel
            </button>
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
        <div
          class="notification-item"
          v-for="(notif, index) in notifications"
          :key="index"
        >
          <h4>Task Completed</h4>
          <p>{{ notif.message }}</p>
          <span class="time">{{ notif.time }}</span>
        </div>
      </div>
    </div>

    <!-- OVERLAY -->
    <div
      class="overlay"
      v-if="showNotifications"
      @click="toggleNotifications"
    ></div>

    <!-- ACTIVITY LOG HEADER -->
    <div class="header-container" :class="{ 'sidebar-collapsed': !isOpen }">
      <h1 class="lists-events" :class="{ 'header-closed': isOpen }">
        ACTIVITY LOG
      </h1>
      <input
        v-model="searchQuery"
        class="input-search-event"
        type="search"
        placeholder="Search event..."
      />
    </div>
    <hr class="hr-input" :class="{ 'sidebar-collapsed-for-divider': isOpen }" />

    <!-- EVENTS TABLE -->
    <div class="container-table" :class="{ 'sidebar-collapsed': !isOpen }">
      <table class="users-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Event Title</th>
            <th>Barangay</th>
            <th>Date</th>
            <th>Time</th>
            <th>Organizer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(event, index) in filteredEvents" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ event.event_title || event.title }}</td>
            <td>{{ event.barangay }}</td>
            <td>{{ formatDate(event.date) }}</td>
            <td>
              {{ formatTime(event.start_time) }} -
              {{ formatTime(event.end_time) }}
            </td>
            <td>{{ event.organizer }}</td>
            <td>
              <button
                v-if="event.status === 'upcoming'"
                @click="unregisterFromEvent(event.id)"
                class="unregister-btn"
              >
                Unregister
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="overlay" v-if="!isMobile && isSidebarOpen"></div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import {
  authService,
  formatTime,
  formatDate,
  eventService,
} from "../api/services";
import axios from "axios";

// Configure axios default base URL (this might be better configured globally elsewhere)
axios.defaults.baseURL = "http://localhost:8000";

const router = useRouter();

const showNotifications = ref(false);
const showLogoutModal = ref(false);
const isOpen = ref(false);
const isSidebarOpen = ref(false);
const isMobile = ref(false);
const searchQuery = ref("");
const events = ref([]);

const notifications = ref([
  {
    message: "You completed the 'Update website content' task.",
    time: "2 hours ago",
  },
  {
    message: "You completed the 'Clean up drive' task.",
    time: "3 hours ago",
  },
  {
    message: "You completed the 'Meeting with organizers' task.",
    time: "5 hours ago",
  },
]);

const filteredEvents = computed(() => {
  if (!Array.isArray(events.value)) {
    return [];
  }
  const query = searchQuery.value.toLowerCase();
  // Using the data structure returned by getEventHistory
  return events.value.filter(
    (event) =>
      event.title?.toLowerCase().includes(query) ||
      event.barangay?.toLowerCase().includes(query) || // Assuming barangay is still in the history data or you adjust the backend map
      event.organizer?.toLowerCase().includes(query) ||
      formatDate(event.date)?.toLowerCase().includes(query)
    // Add time filtering if needed, but it might be complex with ranges
  );
});

async function fetchEventHistory() {
  try {
    console.log("Fetching event history...");
    // Use getEventHistory which is designed for volunteer's events
    const response = await eventService.getEventHistory();
    console.log("API Response for Event History:", response);

    // The backend getEventHistory returns a direct array of event data in response.data
    const eventsData = response.data;

    // The data structure from getEventHistory is already mapped in the backend
    events.value = Array.isArray(eventsData) ? eventsData : [];
    console.log("Processed event history:", events.value);
  } catch (error) {
    console.error("Failed to fetch event history:", error);
    console.error("Error details:", error.response?.data || error.message);
    events.value = []; // Ensure events is an array even on error
    alert("Failed to load event history. Please try again.");
  }
}

async function unregisterFromEvent(eventId) {
  if (!confirm("Are you sure you want to unregister from this event?")) {
    return;
  }

  try {
    await eventService.unregister(eventId);
    await fetchEventHistory(); // Refresh the list
    alert("Successfully unregistered from the event");
  } catch (error) {
    console.error("Failed to unregister:", error);
    alert("Failed to unregister from the event. Please try again.");
  }
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value;
}

function handleResize() {
  isMobile.value = window.innerWidth <= 928;
  if (isMobile.value) {
    isSidebarOpen.value = false;
  }
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  isOpen.value = !isOpen.value;
}

async function confirmLogout() {
  try {
    await authService.logout();
    showLogoutModal.value = false;
    router.push("/LoginVolunteers");
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Failed to logout. Please try again.");
  }
}

onMounted(() => {
  fetchEventHistory();
  window.addEventListener("resize", handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped src="/src/assets/CSS Volunteers/Activitylog.css"></style>
<style scoped>
/* Add these styles to your existing CSS */
.unregister-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.unregister-btn:hover {
  background-color: #c82333;
}

.unregister-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}
</style>
