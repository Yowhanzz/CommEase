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
          <router-link to="/ManageEventsOrganizers">
            <i class="bx bx-calendar-check"></i>
            <span class="nav-item" v-show="isSidebarOpen">Manage Events</span>
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

  <!-- SEARCH + OPTIONS -->
  <div
    class="search-options-container"
    :class="{ 'sidebar-collapsed': !isOpen }"
  >
    <div class="dropdown">
      <button class="dropbtn" @click="toggleDropdown">Options ▼</button>
      <div class="dropdown-content" :class="{ active: showDropdown }">
        <a @click="showQRCode = true">Show My QR Scanner</a>
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

  <!-- QR MODAL -->
  <div v-if="showQRCode" class="qr-modal-overlay">
    <div class="qr-modal-content">
      <button class="close-btn" @click="showQRCode = false">X</button>
      <h3>Record Attendance</h3>
      
      <!-- Event Selection -->
      <div class="event-selection">
        <select v-model="selectedEvent" class="event-select">
          <option value="">Select an event</option>
          <option v-for="event in ongoingEvents" :key="event.id" :value="event">
            {{ event.event_title }} ({{ event.status }})
          </option>
        </select>
      </div>

      <div v-if="selectedEvent" class="scanner-container">
        <h3>Selected Event: {{ selectedEvent.event_title }}</h3>
        
        <!-- Scan type selection -->
        <div class="scan-type-selection">
          <label>
            <input 
              type="radio" 
              v-model="scanType" 
              value="time_in"
            > Time In
          </label>
          <label>
            <input 
              type="radio" 
              v-model="scanType" 
              value="time_out"
            > Time Out
          </label>
        </div>

        <!-- Toggle between QR Scanner and Manual Input -->
        <div class="input-method-toggle">
          <button 
            :class="['toggle-btn', { active: !useManualInput }]" 
            @click="useManualInput = false"
          >
            QR Scanner
          </button>
          <button 
            :class="['toggle-btn', { active: useManualInput }]" 
            @click="useManualInput = true"
          >
            Manual Input
          </button>
        </div>

        <!-- QR Scanner -->
        <div v-if="!useManualInput" class="scanner-section">
        <qrcode-stream
          @detect="onDetect"
          class="scanner-box"
          :constraints="{
            video: {
              facingMode: 'environment',
              frameRate: { ideal: 60, max: 60 },
            },
          }"
        />
        </div>

        <!-- Manual Input -->
        <div v-else class="manual-input-section">
          <input
            v-model="studentID"
            type="text"
            placeholder="Enter Student ID"
            class="event-select"
          />
          <button @click="submitID" class="btn">Submit ID</button>
        </div>
      </div>
      <div v-else class="no-event-selected">
        Please select an event first
      </div>
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
        :events="events"
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
        v-for="(notif, index) in notifications"
        :key="index"
        class="notification-item"
        :class="{ unread: !notif.read }"
      >
        <div class="notification-content">
        <h4>{{ notif.message }}</h4>
        <p class="time">{{ notif.time }}</p>
        </div>
        <div class="notification-type" :class="notif.type">
          {{ notif.type === 'volunteer_time_in' ? 'Time In' : 'Time Out' }}
        </div>
      </div>
      <div v-if="notifications.length === 0" class="no-notifications">
        No notifications yet
      </div>
    </div>
  </div>

  <!-- USER INFO -->
  <div class="container" :class="{ 'sidebar-collapsed': !isOpen }">
    <div class="glasscard-container">
      <div class="picture-1">
        <img src="" alt="profile-pic" class="picture-person" />
      </div>
      <div class="glasscard-titles">
        <h1 class="volunteer-name">Hello, Ridley!</h1>
        <h6 class="service-type">Organizer</h6>
      </div>
    </div>

    <div class="glasscard-container-1">
      <div class="picture-1">
        <img src="" alt="weather" class="picture-person" />
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
      <h1 class="lists-events">CREATED EVENTS</h1>
      <hr class="hr-lists-events" />
    </div>

    <div class="dropdown-separation">
      <!-- DROPDOWN STATUS -->
      <select v-model="selectedStatus" class="program-filter-dropdown">
        <option value="">Status:</option>
        <option value="Pending">Pending</option>
        <option value="Active">Active</option>
        <option value="Completed">Completed</option>
      </select>

      <!-- DROPDOWN PROGRAM -->
      <select v-model="selectedProgram" class="program-filter-dropdown">
        <option value="">All Programs:</option>
        <option value="BSIT">BSIT</option>
        <option value="BSCS">BSCS</option>
        <option value="BSEMC">BSEMC</option>
      </select>
    </div>

    <div class="events-grid">
      <div
        v-for="(event, index) in filteredEvents"
        :key="index"
        class="container-glasscard-events"
      >
        <div class="container-inputs">
          <div class="container-inputs-info">
            <h1 class="container-event-title">{{ event.event_title }}</h1>
            <h6 class="container-event-time">
              {{ formatTime(event.start_time) }} - {{ formatTime(event.end_time) }} ·
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
            <button class="button-start">Start</button>
            <router-link to="/AnalyticsOrganizers" class="button-enter"
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
import 'vue-cal/dist/vuecal.css';
import VueCal from 'vue-cal';
import { QrcodeStream } from 'vue-qrcode-reader';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService, qrService, eventService } from '@/api/services';

export default {
  components: {
    VueCal,
    QrcodeStream,
  },
  setup() {
    const router = useRouter();
    const searchQuery = ref('');
    const selectedStatus = ref('');
    const selectedProgram = ref('');
    const studentID = ref('');
    const scanType = ref('time_in');
    const timedIDs = new Set();
    const showDropdown = ref(false);
    const showNotifications = ref(false);
    const showLogoutModal = ref(false);
    const isSidebarOpen = ref(false);
    const isOpen = ref(false);
    const qrData = ref('sample-qr-data');
    const calendarVisible = ref(false);
    const selectedEvent = ref(null);
    const showQRCode = ref(false);
    const useManualInput = ref(false);
    const notifications = ref([]);
    const events = ref([]);

    // Only show ongoing events in the QR scanner dropdown
    const ongoingEvents = computed(() => events.value.filter(e => e.status && e.status.toLowerCase() === 'ongoing'));

    // Fetch events from backend
    const fetchEvents = async () => {
      try {
        const response = await eventService.getEventsOrganizer();
        events.value = response.data;
        console.log('Fetched organizer events:', events.value);
      } catch (err) {
        console.error('Failed to fetch organizer events:', err);
      }
    };

    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        notifications.value = response.data;
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    onMounted(() => {
      fetchEvents();
      fetchNotifications();
    });

    const filteredEvents = computed(() => {
      return events.value.filter((event) => {
        const matchesSearch =
          (event.event_title?.toLowerCase() || '').includes(searchQuery.value.toLowerCase()) ||
          (event.barangay?.toLowerCase() || '').includes(searchQuery.value.toLowerCase());

        const matchesStatus =
          selectedStatus.value === '' || event.status === selectedStatus.value;

        const matchesProgram =
          selectedProgram.value === '' ||
          (event.programs && event.programs.includes(selectedProgram.value));

        return matchesSearch && matchesStatus && matchesProgram;
      });
    });

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
      isOpen.value = !isOpen.value;
    };

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value;
    };

    const toggleCalendar = () => {
      calendarVisible.value = !calendarVisible.value;
      showDropdown.value = false;
    };

    const onDetect = async (result) => {
      try {
        const scannedText = result[0].rawValue;
        const userEmailId = scannedText.split('@')[0];
        
        if (!userEmailId) {
          throw new Error("Invalid QR code format");
        }

        if (!selectedEvent.value) {
          throw new Error("No event selected");
        }

        const response = await qrService.scanQR(selectedEvent.value.id, userEmailId, scanType.value);
        
        // Update notifications
        await updateNotifications(
          `${scanType.value === 'time_in' ? 'Time In' : 'Time Out'} recorded for ${selectedEvent.value.event_title}`,
          scanType.value === 'time_in' ? 'volunteer_time_in' : 'volunteer_time_out'
        );

        alert(`${scanType.value === 'time_in' ? 'Time In' : 'Time Out'} recorded: ${response.message}`);
      } catch (error) {
        console.error('QR scan failed:', error);
        alert(error.response?.data?.message || error.message || 'Failed to process QR code');
      }
    };

    const submitID = async () => {
      try {
        const id = studentID.value.trim();
        if (!/^\d+$/.test(id)) {
          alert("Student ID must contain only numbers.");
          return;
        }
        if (id.length !== 9) {
          alert("Student ID must be exactly 9 digits.");
          return;
        }

        if (!selectedEvent.value) {
          throw new Error("No event selected");
        }

        const response = await qrService.scanQR(selectedEvent.value.id, id, scanType.value);
        
        // Update notifications
        await updateNotifications(
          `${scanType.value === 'time_in' ? 'Time In' : 'Time Out'} recorded for ${selectedEvent.value.event_title}`,
          scanType.value === 'time_in' ? 'volunteer_time_in' : 'volunteer_time_out'
        );

        alert(`${scanType.value === 'time_in' ? 'Time In' : 'Time Out'} recorded: ${response.message}`);
        studentID.value = '';
      } catch (error) {
        console.error('Manual ID submission failed:', error);
        alert(error.response?.data?.message || error.message || 'Failed to process ID');
      }
    };

    const onDateClick = ({ date }) => {
      const selected = events.value.find(
        (event) =>
          new Date(event.start).toLocaleDateString() ===
          new Date(date).toLocaleDateString()
      );
      selectedEvent.value = selected || null;
    };

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };

    const formatTime = (datetime) => {
      return new Date(datetime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const formatDate = (datetime) => {
      return new Date(datetime).toLocaleDateString([], {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const confirmLogout = async () => {
      try {
        await authService.logout();
        showLogoutModal.value = false;
        router.push('/LoginOrganizers');
      } catch (error) {
        console.error('Logout failed:', error);
        alert('Failed to logout. Please try again.');
      }
    };

    // Update notification panel after successful scan
    const updateNotifications = async (message, type) => {
      try {
        // Add new notification to the list
        notifications.value.unshift({
          message,
          type,
          time: 'Just now',
          read: false
        });

        // Keep only the latest 10 notifications
        if (notifications.value.length > 10) {
          notifications.value = notifications.value.slice(0, 10);
        }
      } catch (error) {
        console.error('Failed to update notifications:', error);
      }
    };

    return {
      searchQuery,
      selectedStatus,
      selectedProgram,
      studentID,
      scanType,
      timedIDs,
      showDropdown,
      showNotifications,
      showLogoutModal,
      isSidebarOpen,
      isOpen,
      qrData,
      calendarVisible,
      selectedEvent,
      showQRCode,
      useManualInput,
      notifications,
      events,
      filteredEvents,
      ongoingEvents,
      toggleSidebar,
      toggleDropdown,
      toggleCalendar,
      onDetect,
      onDateClick,
      toggleNotifications,
      formatTime,
      formatDate,
      confirmLogout,
      submitID,
      fetchEvents,
      fetchNotifications,
    };
  },
};
</script>

<style scoped src="/src/assets/CSS Organizers/dashboard.css"></style>

<style scoped>
.event-selection {
  margin-bottom: 20px;
}

.event-select {
  width: 90%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #12372a;
  background-color: white;
  font-size: 14px;
}

.scanner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  margin-top: 10px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.toggle-btn {
  padding: 8px 15px;
  border: 1px solid #12372a;
  border-radius: 5px;
  background: #f0f0f0;
  transition: background-color 0.3s;
}

.toggle-btn.active {
  background: #12372a;
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
</style>
