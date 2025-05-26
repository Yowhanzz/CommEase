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
          <router-link to="SafetyProtocols">
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
      <button class="dropbtn" @click="toggleDropdown">Options ▼</button>
      <div class="dropdown-content" :class="{ active: showDropdown }">
        <a @click="showQRCode = true">Show My QR Code</a>
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
      <vue-qrcode :value="qrValue" :options="{ width: 200, height: 200 }" />
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
        :events="events_test"
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
  <div class="notification-panel" :class="{ open: showNotifications }">
    <div class="notification-header">
      <h3>Notifications</h3>
      <span class="close-btn" @click="toggleNotifications">&times;</span>
    </div>
    <div class="notification-list">
      <div
        class="notification-item"
        v-for="(notif, index) in notifications"
        :key="index"
      >
        <h4>{{ notif.message }}</h4>
        <p class="time">{{ notif.time }}</p>
      </div>
    </div>
  </div>

  <!-- USER INFO -->
  <div class="container" :class="{ 'sidebar-collapsed': !isOpen }">
    <div class="glasscard-container">
      <div class="picture-1">
        <img src="" alt="shrek sample pic" class="picture-person" />
      </div>
      <div class="glasscard-titles">
        <h1 class="volunteer-name">Hello, Johannes!</h1>
        <h6 class="service-type">Volunteer</h6>
      </div>
    </div>

    <div class="glasscard-container-1">
      <div class="picture-1">
        <img src="" alt="shrek sample pic" class="picture-person" />
      </div>
      <div class="glasscard-titles">
        <h1 class="volunteer-name">Mon, Mar 27, 2025</h1>
        <h6 class="service-type">40 °C</h6>
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

    <div class="events-grid">
      <div
        v-for="(event, index) in filteredEvents"
        :key="index"
        class="container-glasscard-events"
      >
        <div class="container-inputs">
          <div class="container-inputs-info">
            <h1 class="container-event-title">{{ event.title }}</h1>
            <h6 class="container-event-time">
              {{ formatTime(event.start) }} - {{ formatTime(event.end) }} ·
              {{ formatDate(event.start) }}
            </h6>
            <h6 class="container-event-location">
              {{ event.location }}
            </h6>
            <h6 class="container-event-location">
              For {{ (event.programs || []).join(", ") }} only
            </h6>
            <h6 class="container-event-location">{{ event.organizer }}</h6>
          </div>
          <div class="button">
            <router-link to="/RegistrationVolunteers" class="button-enter"
              >Enter</router-link
            >
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
import { authService } from '../api/services';

export default {
  components: {
    QrcodeStream,
    VueCal,
    VueQrcode,
  },
  data() {
    return {
      // QR Code
      showQRCode: false,
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
        /* ADDED */
        {
          start: "2025-05-05 6:25",
          end: "2025-05-05 8:20",
          title: "Clean up Drive",
        },
      ], // start with empty events

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

      // 🔥 Cleared static events – dynamic only!
      events: [],
    };
  },
  computed: {
    filteredEvents() {
      return this.events.filter((event) => {
        const matchesSearch =
          event.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(this.searchQuery.toLowerCase());

        const matchesProgram = this.selectedProgram
          ? event.programs.includes(this.selectedProgram)
          : true;

        const matchesStatus = this.selectedStatus
          ? event.status === this.selectedStatus
          : true;

        return matchesSearch && matchesProgram && matchesStatus;
      });
    },
  },
  mounted() {
    // ✅ Now it's outside computed!
    const storedEvents = JSON.parse(localStorage.getItem("events"));
    if (storedEvents && storedEvents.length) {
      this.events = storedEvents.map((event) => {
        const [startTime, endTime] = event.time.split(" - ");
        const startDateTime = `${event.date}T${startTime}`;
        const endDateTime = `${event.date}T${endTime}`;
        return {
          start: startDateTime,
          end: endDateTime,
          title: event.title,
          location: `Barangay ${event.barangay}`,
          organizer: event.organizer,
          status: event.status,
          programs: event.programs || [],
        };
      });
    }
  },

  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
      this.isOpen = !this.isOpen;
    },

    handleResize() {
      /* ADDED */
      this.isMobile = window.innerWidth <= 928;
      if (this.isMobile) {
        this.isSidebarOpen = false;
      }
    },

    toggleDropdown() {
      console.log("Dropdown toggled", this.showDropdown);
      this.showDropdown = !this.showDropdown;
    },
    closeQRCode() {
      this.showQRCode = false;
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
    formatTime(datetime) {
      return new Date(datetime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    formatDate(datetime) {
      return new Date(datetime).toLocaleDateString([], {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    onDateClick({ date }) {
      const selected = this.events.find((event) => {
        const eventDate = new Date(event.start).toLocaleDateString();
        return eventDate === new Date(date).toLocaleDateString();
      });
      this.selectedEvent = selected || null;
      console.log(
        selected ? "Clicked Event:" : "No event on selected date.",
        selected
      );
    },
    async confirmLogout() {
      try {
        await authService.logout();
        this.showLogoutModal = false;
        // Redirect to login page
        this.$router.push('/LoginVolunteers');
      } catch (error) {
        console.error('Logout failed:', error);
        alert('Failed to logout. Please try again.');
      }
    },
  },
};
</script>

<style scoped src="/src/assets/CSS Volunteers/dashboard.css"></style>
