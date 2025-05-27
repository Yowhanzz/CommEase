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
            <router-link to="/dashboard_volunteers">
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
            <td>{{ event.title }}</td>
            <td>{{ event.barangay }}</td>
            <td>{{ formatDate(event.date) }}</td>
            <td>{{ formatTime(event.time_in) }} - {{ formatTime(event.time_out) }}</td>
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

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../api/services';
import axios from 'axios';

// Configure axios default base URL
axios.defaults.baseURL = 'http://localhost:8000'; // Update this to match your Laravel backend URL

export default {
  data() {
    return {
      showNotifications: false,
      showLogoutModal: false,
      isOpen: false,
      isSidebarOpen: false,
      isMobile: false,
      searchQuery: "",
      notifications: [
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
      ],
      events: [],
    };
  },
  computed: {
    filteredEvents() {
      if (!Array.isArray(this.events)) {
        return [];
      }
      const query = this.searchQuery.toLowerCase();
      return this.events.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.organizer.toLowerCase().includes(query) ||
          this.formatDate(event.date).toLowerCase().includes(query)
      );
    },
  },
  methods: {
    async fetchEventHistory() {
      try {
        console.log('Fetching event history...');
        const response = await axios.get('/api/event-history', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          withCredentials: true // This is important for handling cookies/session
        });
        console.log('API Response:', response.data);
        this.events = Array.isArray(response.data) ? response.data : [];
        console.log('Processed events:', this.events);
      } catch (error) {
        console.error('Failed to fetch event history:', error);
        console.error('Error details:', error.response?.data || error.message);
        this.events = []; // Ensure events is an array even on error
        alert('Failed to load event history. Please try again.');
      }
    },

    async unregisterFromEvent(eventId) {
      if (!confirm('Are you sure you want to unregister from this event?')) {
        return;
      }

      try {
        await axios.post(`/api/events/${eventId}/unregister`);
        await this.fetchEventHistory(); // Refresh the list
        alert('Successfully unregistered from the event');
      } catch (error) {
        console.error('Failed to unregister:', error);
        alert('Failed to unregister from the event. Please try again.');
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    },

    formatTime(timeString) {
      if (!timeString) return 'N/A';
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    },

    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },

    handleResize() {
      this.isMobile = window.innerWidth <= 928;
      if (this.isMobile) {
        this.isSidebarOpen = false;
      }
    },

    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
      this.isOpen = !this.isOpen; 
    }, 

    async confirmLogout() {
      try {
        await authService.logout();
        this.showLogoutModal = false;
        this.$router.push('/LoginVolunteers');
      } catch (error) {
        console.error('Logout failed:', error);
        alert('Failed to logout. Please try again.');
      }
    }
  },
  mounted() {
    this.fetchEventHistory();
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
};
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
