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
      <button @click="openQRCodeModal" class="icon-button">
        <i class="bx bx-qr"></i>
      </button>

      <button
        @click="openCalendarModal"
        class="calendar-btn"
        title="Open Calendar"
      >
        <i class="bx bx-calendar"></i>
      </button>
    </div>

    <div class="search-input-container">
      <input
        v-model="searchQuery"
        class="input-search-event"
        type="search"
        placeholder="Search event..."
      />

      <div class="live-time">
        {{ currentTime }}
      </div>
    </div>
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
        :events="calendarEvents"
        @cell-click="onDateClick"
        @event-click="onEventClick"
        :disable-views="['years', 'year']"
        :time-from="5 * 60"
        :time-to="22 * 60"
        :time-step="30"
        :snap-to-time="30"
        :show-all-day-events="true"
        default-view="month"
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

  <!-- NOTIFICATION COMPONENT -->
  <NotificationPanel
    :isOpen="showNotifications"
    :notifications="notifications"
    :loading="notificationLoading"
    :unreadCount="unreadCount"
    @close="toggleNotifications"
    @mark-as-read="handleMarkAsRead"
    @mark-all-as-read="handleMarkAllAsRead"
    @delete-notification="handleDeleteNotification"
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
      <option value="pending">Pending</option>
      <option value="upcoming">Upcoming</option>
      <option value="ongoing">Ongoing</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
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
              v-if="
                event.status &&
                ['pending', 'upcoming'].includes(event.status.toLowerCase())
              "
              @click="registerForEvent(event.id)"
              class="button-enter"
            >
              Register
            </button>
            <span v-else class="button-enter disabled">
              {{
                event.status
                  ? event.status.charAt(0).toUpperCase() + event.status.slice(1)
                  : "Unknown"
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="overlay" v-if="!isMobile && isSidebarOpen"></div>

  <!-- Calendar Modal -->
  <div
    v-if="showCalendarModal"
    class="calendar-modal-overlay"
    @click="closeCalendarModal"
  >
    <div class="calendar-modal" @click.stop>
      <div class="calendar-modal-header">
        <h2>Event Calendar</h2>
        <button @click="closeCalendarModal" class="close-calendar-btn">
          <i class="bx bx-x"></i>
        </button>
      </div>
      <div class="calendar-modal-content">
        <CustomCalendar />
      </div>
    </div>
  </div>
</template>

<script>
import { QrcodeStream } from "vue-qrcode-reader";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import NotificationPanel from "@/components/NotificationPanel.vue"; // Import the notification component
import CustomCalendar from "@/components/CustomCalendar.vue"; // Import the calendar component

import {
  authService,
  eventService,
  formatTime,
  formatDate,
  formatEventForCalendar,
  qrService,
} from "../api/services";
import { useNotifications } from "@/composables/useNotifications";
import axios from "axios";

export default {
  name: "safety",

  components: {
    QrcodeStream,
    VueCal,
    VueQrcode,
    NotificationPanel, // Register the component
    CustomCalendar, // Register the calendar component
  },
  setup() {
    // Use notification composable
    const {
      notifications,
      notificationLoading,
      unreadCount,
      showNotifications,
      fetchNotifications,
      toggleNotifications,
      handleMarkAsRead,
      handleMarkAllAsRead,
      handleDeleteNotification,
      addLocalNotification,
    } = useNotifications();

    return {
      formatTime,
      formatDate,
      // Notification functionality
      notifications,
      notificationLoading,
      unreadCount,
      showNotifications,
      fetchNotifications,
      toggleNotifications,
      handleMarkAsRead,
      handleMarkAllAsRead,
      handleDeleteNotification,
      addLocalNotification,
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
      showLogoutModal: false,
      isSidebarOpen: false,
      isOpen: false,
      calendarVisible: false,
      selectedEvent: null,
      selectedProgram: "",
      selectedStatus: "",
      events_test: [
        {
          start: "2025-05-08T06:25:00",
          end: "2025-05-08T08:20:00",
          title: "Clean up Drive",
        },
      ],
      events: [],
      allEvents: [], // For calendar display - all events regardless of registration
      loading: false,
      error: null,
      firstName: "",
      weather: {
        temperature: "",
        description: "",
        icon: "",
      },
      currentTime: "",
      showCalendarModal: false,
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
    calendarEvents() {
      // Transform all events for calendar display
      const transformed = this.allEvents
        .map((event) => {
          const formatted = formatEventForCalendar(event);
          if (!formatted) {
            console.warn("Failed to format event:", event);
          }
          return formatted;
        })
        .filter((event) => event !== null);
      console.log("Transformed calendar events:", transformed);
      return transformed;
    },
  },
  async mounted() {
    await this.fetchEvents();
    await this.fetchAllEvents();
    await this.fetchUserData();
    await this.fetchWeather();
    this.startTimeUpdates();
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    window.removeEventListener("resize", this.handleResize);
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
    async fetchAllEvents() {
      try {
        const response = await eventService.getAllEvents();

        // Handle both possible response structures
        const eventsData = response.data.data || response.data;
        this.allEvents = Array.isArray(eventsData) ? eventsData : [];

        // Log first event for debugging
        if (this.allEvents.length > 0) {
          console.log("Sample event:", this.allEvents[0]);
        }
      } catch (err) {
        console.error("Error fetching all events for calendar:", err);
        console.error("Error details:", err.response?.data);
      }
    },
    async fetchUserData() {
      try {
        const userData = await authService.getUser();
        console.log("🔍 User data from authService:", userData);

        // Try different possible field names
        const possibleNames = [
          userData.first_name,
          userData.firstName,
          userData.name,
          userData.full_name?.split(" ")[0],
          userData.email?.split("@")[0],
        ];

        this.firstName =
          possibleNames.find((name) => name !== undefined) || "User";
        console.log("✅ User data loaded:", this.firstName);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
        this.firstName = "User"; // Fallback name
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

    onDateClick({ date }) {
      const selected = this.allEvents.find((event) => {
        const eventDate = new Date(event.date).toLocaleDateString();
        return eventDate === new Date(date).toLocaleDateString();
      });
      this.selectedEvent = selected || null;
    },
    onEventClick(event, e) {
      // Find the original event data from the calendar event
      const originalEvent = this.allEvents.find(
        (evt) => evt.event_title === event.title
      );
      if (originalEvent) {
        this.selectedEvent = originalEvent;
        // You can add more actions here, like showing event details
        console.log("Selected event:", originalEvent);
      }
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
    // Time update methods
    updateTime() {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      // Ensure there's exactly one space before AM/PM
      this.currentTime = timeString.replace(/\s+/g, " ");
    },
    startTimeUpdates() {
      this.updateTime(); // Initial update
      this.timeInterval = setInterval(this.updateTime, 1000); // Update every second
    },
    // Calendar modal methods
    openCalendarModal() {
      this.showCalendarModal = true;
      this.showDropdown = false;
    },
    closeCalendarModal() {
      this.showCalendarModal = false;
    },
  },
};
</script>

<style scoped src="/src/assets/CSS Volunteers/dashboard.css"></style>

<style scoped>
.event-selection {
  margin-bottom: 20px;
}

.event-select {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #12372a;
  background-color: #435739;
  background-color: white;
  font-size: 14px;
}

.event-select-id {
  width: 127%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #12372a;
  background-color: #435739;
  background-color: white;
  font-size: 14px;
  margin-bottom: 10px;
}

.scanner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.submit-btn {
  height: 40px;
  width: 127%;
  border-radius: 5px;
  border: 1px solid #12372a;
  border-radius: 5px;
  background: #f0f0f0;
  background-color: #435739;
  color: white;
  font-weight: 550;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.submit-btn:hover {
  background-color: #f2f4ec;
  color: #435739;
  border: 2px solid #435739;
  font-weight: 550;
}

.no-event-selected {
  text-align: center;
  color: #666;
  padding: 20px;
  font-style: italic;
}

.scan-type-selection {
  margin: 15px 0;
  display: flex;
  gap: 20px;
  justify-content: center;
}

.scan-type-selection label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 5px;
}

/* Calendar event styling */
:deep(.vuecal__event) {
  border-radius: 6px;
  font-size: 12px;
  padding: 2px 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

:deep(.event-status-pending) {
  background-color: #fbbf24 !important;
  color: #92400e !important;
  border-left: 4px solid #f59e0b;
}

:deep(.event-status-upcoming) {
  background-color: #60a5fa !important;
  color: #1e40af !important;
  border-left: 4px solid #3b82f6;
}

:deep(.event-status-ongoing) {
  background-color: #34d399 !important;
  color: #065f46 !important;
  border-left: 4px solid #10b981;
}

:deep(.event-status-completed) {
  background-color: #9ca3af !important;
  color: #374151 !important;
  border-left: 4px solid #6b7280;
}

:deep(.event-status-cancelled) {
  background-color: #f87171 !important;
  color: #7f1d1d !important;
  border-left: 4px solid #ef4444;
}

:deep(.calendar-event-content) {
  line-height: 1.2;
}

:deep(.calendar-event-content strong) {
  display: block;
  margin-bottom: 2px;
}

:deep(.calendar-event-content small) {
  display: block;
  opacity: 0.8;
  font-size: 10px;
}

.scan-type-selection label {
  background: #f0f0f0;
  transition: background-color 0.3s;
}

.scan-type-selection label:hover {
  background: #e0e0e0;
}

.scan-type-selection input[type="radio"] {
  margin: 0;
}

.input-method-toggle {
  margin-top: 5px;
  margin-bottom: 5px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.toggle-btn {
  padding: 8px 15px;
  background-color: #435739;
  border-radius: 5px;
  background: #f0f0f0;
  transition: background-color 0.3s;
  cursor: pointer;
  border-style: none;
}
.toggle-btn:hover {
  background-color: #e0e0e0;
  color: black;
}

.toggle-btn.active {
  background-color: #435739;
  color: white;
}

.scanner-section {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.manual-input-section {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.notification-panel {
  position: fixed;
  right: -300px;
  top: 0;
  width: 300px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
}

.notification-panel.open {
  right: 0;
}

.notification-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-list {
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.notification-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: background-color 0.3s;
}

.notification-item:hover {
  background-color: #f9f9f9;
}

.notification-item.unread {
  background-color: #f0f7ff;
}

.notification-content {
  flex: 1;
}

.notification-content h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #333;
}

.notification-content .time {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.notification-type {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.notification-type.volunteer_time_in {
  background-color: #e3f2fd;
  color: #1976d2;
}

.notification-type.volunteer_time_out {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.no-notifications {
  padding: 20px;
  text-align: center;
  color: #666;
  font-style: italic;
}

/* Weather styling */
.weather-icon {
  width: 100px;
  height: 100px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.6);
  padding: 10px;
  transition: transform 0.3s ease;
}

.weather-description {
  font-size: 1.2rem;
  color: #666;
  margin-top: 5px;
  text-transform: capitalize;
}

/* Simple Border Container */
.search-input-container {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 500px;
}

/* Modern Clean Live Time */
.live-time {
  background: transparent;
  color: #435739;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
  border: none;
  min-width: 130px;
  text-align: left;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
}

/* Gradient Border Search Input */
.input-search-event {
  width: 300px;
  max-width: 300px;
  height: 46px;
  padding: 0 18px;
  border: 2px solid transparent;
  border-radius: 12px;
  background: linear-gradient(white, white) padding-box,
    linear-gradient(135deg, #e2e8f0, #cbd5e1) border-box;
  font-size: 14px;
  font-weight: 400;
  color: #1e293b;
  transition: all 0.2s ease;
  outline: none;
}

.input-search-event::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.input-search-event:focus {
  background: linear-gradient(white, white) padding-box,
    linear-gradient(135deg, #435739, #6b8a4f) border-box;
}

.input-search-event:hover:not(:focus) {
  background: linear-gradient(white, white) padding-box,
    linear-gradient(135deg, #94a3b8, #cbd5e1) border-box;
}

/* Gradient Border Calendar Button */
.calendar-btn {
  background-color: #435739;
  color: #f2f4ec;
  border: 2px solid transparent;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 18px;
}

.calendar-btn:hover {
  background-color: #f2f4ec;
  color: #435739;
  border: 2px solid #435739;
  transform: translateY(-1px);
}

.calendar-btn:active {
  transform: translateY(0);
}

/* Simple Calendar Modal */
.calendar-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.calendar-modal {
  background: #f2f4ec;
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.calendar-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  color: black;
}

.calendar-modal-header h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.close-calendar-btn {
  background: rgba(27, 27, 27, 0.1);
  border: none;
  color: black;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 18px;
}

.close-calendar-btn:hover {
  background: rgba(175, 175, 175, 0.2);
}

.calendar-modal-content {
  padding: 20px;
  max-height: calc(80vh - 80px);
  overflow-y: auto;
}

/* Responsive Gradient Design */
@media (max-width: 768px) {
  .search-input-container {
    gap: 15px;
    max-width: 400px;
  }

  .live-time {
    padding: 12px 16px;
    font-size: 12px;
    min-width: 100px;
  }

  .input-search-event {
    width: 220px;
    max-width: 220px;
    height: 44px;
    padding: 0 16px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .search-input-container {
    max-width: 320px;
    gap: 8px;
  }

  .live-time {
    padding: 8px 12px;
    font-size: 11px;
    min-width: 90px;
  }

  .input-search-event {
    width: 160px;
    max-width: 160px;
    height: 40px;
    padding: 0 12px;
    font-size: 12px;
  }
}
</style>
