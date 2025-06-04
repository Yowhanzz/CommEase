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
          <router-link to="/safety_protocol">
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
  </header>

  <!-- SEARCH AND OPTIONS -->
  <div
    class="search-options-container"
    :class="{ 'sidebar-collapsed': !isOpen }"
  >
    <div class="dropdown">
      <button class="dropbtn" @click="toggleDropdown">Menu ▼</button>
      <div class="dropdown-content" :class="{ active: showDropdown }">
        <a @click="openQRCodeModal">Show My QR Code</a>
        <a @click="toggleCalendar">Calendar</a>
      </div>
    </div>

    <input
      v-model="searchQuery"
      class="input-search-event"
      type="search"
      placeholder="Search event..."
    />
  </div>

  <hr
    class="search-divider"
    :class="{ 'sidebar-collapsed-for-divider': isOpen }"
  />

  <!-- Modal QR Code -->
  <div v-if="showQRCode" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">Your QR Code</h3>
        <button class="close-btn-qr" @click="closeQRCode">✕</button>
      </div>
      <img
        v-if="qrValue"
        :src="qrValue"
        alt="QR Code"
        class="qr-code"
        style="width: 200px; height: 200px"
      />
      <p class="qr-label">
        Scan this QR to attend quickly to the event you want
      </p>
    </div>
  </div>

  <!-- CALENDAR MODAL -->
  <div v-if="calendarVisible" class="calendar-modal-overlay">
    <div class="calendar-modal">
      <div class="calendar-header">
        <h3>Event Calendar</h3>
        <button class="close-btn" @click="calendarVisible = false">✕</button>
      </div>
      <vue-cal
        style="height: 500px"
        :events="
          events.map((event) => ({
            start: event.start_time,
            end: event.end_time,
            title: event.event_title,
          }))
        "
        @cell-click="onDateClick"
      />
    </div>
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

  <!-- NOTIFICATION PANEL -->
  <notifications
    :showNotifications="showNotifications"
    @toggleNotifications="toggleNotifications"
    :notifications="notifications"
  />

  <!-- USER INFO -->
  <div class="container" :class="{ 'sidebar-collapsed': !isOpen }">
    <div class="glasscard-container">
      <div class="picture-1">
        <img
          src="/public/Profile.jpg"
          alt="shrek sample pic"
          class="picture-person"
        />
      </div>
      <div class="glasscard-titles">
        <h1 class="volunteer-name">Hello, {{ firstName }}!</h1>
        <h6 class="service-type">Volunteer</h6>
      </div>
    </div>

    <div class="glasscard-container-1">
      <div class="picture-1">
        <img
          v-if="weather.icon"
          :src="`http://openweathermap.org/img/wn/${weather.icon}@2x.png`"
          :alt="weather.description"
          class="weather-icon"
        />
      </div>
      <div class="glasscard-titles">
        <h1 class="volunteer-name">
          {{
            new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          }}
        </h1>
        <h6 class="service-type">{{ weather.temperature }}°C</h6>
        <p class="weather-description">{{ weather.description }}</p>
      </div>
    </div>
  </div>

  <!-- EVENTS LIST -->
  <div class="container-events test" :class="{ 'sidebar-collapsed': !isOpen }">
    <div>
      <h1 class="lists-events">LISTS OF EVENTS</h1>
      <hr class="hr-lists-events" />
    </div>

    <select v-model="selectedStatus" class="program-filter-dropdown">
      <option value="">Status:</option>
      <option value="Pending">Pending</option>
      <option value="Active">Active</option>
      <option value="Completed">Completed</option>
    </select>

    <div
      class="events-grid"
      :class="{ 'test-grid': filteredEvents.length === 1 }"
    >
      <!-- ADDED -->
      <div v-if="loading" class="loading-message">Loading events...</div>
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>
      <div v-else-if="filteredEvents.length === 0" class="no-events-message">
        No events found matching your criteria.
      </div>
      <div
        v-else
        v-for="(event, index) in filteredEvents"
        :key="index"
        class="container-glasscard-events"
      >
        <div class="container-inputs">
          <div class="container-inputs-info">
            <h1 class="container-event-title">{{ event.event_title }}</h1>
            <h6 class="container-event-time">
              {{ formatTime(event.start_time) }} -
              {{ formatTime(event.end_time) }} ·
              {{ formatDate(event.date) }}
            </h6>
            <h6 class="container-event-location">
              Barangay {{ event.barangay }}
            </h6>
            <h6 class="container-event-programs">
              For {{ (event.programs || []).join(", ") }} only
            </h6>
            <h6 class="container-event-organizer">
              {{ event.organizer?.first_name }} {{ event.organizer?.last_name }}
            </h6>
          </div>
          <div class="button">
            <button
              v-if="event.status && event.status.toLowerCase() === 'upcoming'"
              @click="registerForEvent(event.id)"
              class="button-enter"
            >
              Register
            </button>
            <span v-else class="button-enter disabled">
              {{ event.status.charAt(0).toUpperCase() + event.status.slice(1) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="overlay" v-if="!isMobile && isSidebarOpen"></div>
</template>

<script>
import { QrcodeStream } from "vue-qrcode-reader";
import VueCal from "vue-cal";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import "vue-cal/dist/vuecal.css";
import Notifications from "@/components/notifications.vue";

import {
  authService,
  eventService,
  formatTime,
  formatDate,
  qrService,
} from "../api/services";
import axios from "axios";

export default {
  components: {
    QrcodeStream,
    VueCal,
    VueQrcode,
  },
  setup() {
    return {
      formatTime,
      formatDate,
    };
  },
  data() {
    return {
      // QR Code
      showQRCode: false,
      qrValue: "",
      userEmail: "",
      userPassword: "",

      //
      isMobile: false,

      // Search & UI
      searchQuery: "",
      showDropdown: false,
      activeContent: null,
      showNotifications: false,
      showLogoutModal: false,
      isSidebarOpen: false,
      isOpen: false,
      calendarVisible: false,
      selectedEvent: null,
      selectedProgram: "",
      selectedStatus: "",
      events_test: [
        {
          start: "2025-05-08 6:25",
          end: "2025-05-08 8:20",
          title: "Clean up Drive",
        },
      ],
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
      loading: false,
      error: null,
      firstName: "",
      weather: {
        temperature: "",
        description: "",
        icon: "",
      },
    };
  },
  computed: {
    filteredEvents() {
      return this.events.filter((event) => {
        const matchesSearch =
          event.event_title
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          event.barangay.toLowerCase().includes(this.searchQuery.toLowerCase());

        const matchesStatus = this.selectedStatus
          ? event.status === this.selectedStatus
          : true;

        return matchesSearch && matchesStatus;
      });
    },
  },
  async mounted() {
    await this.fetchEvents();
    await this.fetchUserData();
    await this.fetchWeather();
  },
  methods: {
    async fetchEvents() {
      try {
        this.loading = true;
        this.error = null;
        const response = await eventService.getEventsVolunteer();
        // Handle both possible response structures
        const eventsData = response.data.data || response.data;
        this.events = Array.isArray(eventsData) ? eventsData : [];
      } catch (err) {
        this.error = err.response?.data?.message || "Failed to fetch events";
        console.error("Error fetching events:", err);
      } finally {
        this.loading = false;
      }
    },
    async fetchUserData() {
      try {
        const response = await axios.get("/api/user");
        this.firstName = response.data.first_name;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
      this.isOpen = !this.isOpen;
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 928;
      if (this.isMobile) {
        this.isSidebarOpen = false;
      }
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    async openQRCodeModal() {
      try {
        // Fetch permanent user QR code from backend
        const response = await qrService.getUserQR();
        this.qrValue = response.qr_code;
        this.showQRCode = true;
      } catch (error) {
        alert("Failed to generate QR code");
        this.qrValue = "";
      }
    },
    closeQRCode() {
      this.showQRCode = false;
      this.qrValue = "";
      localStorage.setItem("qrModalShown", "true");
    },
    toggleCalendar() {
      this.calendarVisible = !this.calendarVisible;
      this.showDropdown = false;
    },
    showContent(type) {
      this.activeContent = type;
      this.showDropdown = false;
    },
    closeModal() {
      this.activeContent = null;
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },
    onDateClick({ date }) {
      const selected = this.events.find((event) => {
        const eventDate = new Date(event.date).toLocaleDateString();
        return eventDate === new Date(date).toLocaleDateString();
      });
      this.selectedEvent = selected || null;
    },
    async confirmLogout() {
      try {
        await authService.logout();
        this.showLogoutModal = false;
        this.$router.push("/LoginVolunteers");
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Failed to logout. Please try again.");
      }
    },
    async registerForEvent(eventId) {
      this.$router.push(`/RegistrationVolunteers/${eventId}`);
    },
    async fetchWeather() {
      try {
        // Replace with your actual API key
        const API_KEY = "476431119c6012c1e8cb59bb59fb3668";
        const city = "Olongapo"; // Default city
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );

        this.weather = {
          temperature: Math.round(response.data.main.temp),
          description: response.data.weather[0].description,
          icon: response.data.weather[0].icon,
        };
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    },
  },
};
</script>

<style scoped src="/src/assets/CSS Volunteers/dashboard.css"></style>
