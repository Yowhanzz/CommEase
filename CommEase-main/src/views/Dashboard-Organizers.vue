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
          <router-link to="/ArchivedEventsOrganizers">
            <i class="bx bx-archive"></i>
            <span class="nav-item" v-show="isSidebarOpen">Archived Events</span>
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
      <button @click="showQRCode = true" class="icon-button">
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
            <input type="radio" v-model="scanType" value="time_in" /> Time In
          </label>
          <label>
            <input type="radio" v-model="scanType" value="time_out" /> Time Out
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
            class="event-select-id"
          />
          <button @click="submitID" class="submit-btn">Submit ID</button>
        </div>
      </div>
      <div v-else class="no-event-selected">Please select an event first</div>
    </div>
  </div>

  <!-- CALENDAR MODAL -->
  <div v-if="calendarVisible" class="calendar-modal-overlay">
    <div class="calendar-modal">
      <div class="calendar-header">
        <h3>Event Calendar</h3>
        <button class="close-btn" @click="calendarVisible = false">✕</button>
      </div>
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
          alt="profile-pic"
          class="picture-person"
        />
      </div>
      <div class="glasscard-titles">
        <h1 class="volunteer-name">Hello, {{ firstName }}!</h1>
        <h6 class="service-type">Organizer</h6>
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
        <img
          v-else
          src="/public/Profile.jpg"
          alt="weather"
          class="picture-person"
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
      <h1 class="lists-events">CREATED EVENTS</h1>
      <hr
        class="hr-lists-events"
        :class="{ 'sidebar-collapsed-for-divider': isOpen }"
      />
    </div>

    <div class="dropdown-separation">
      <!-- DROPDOWN STATUS -->
      <select v-model="selectedStatus" class="program-filter-dropdown">
        <option value="">Status:</option>
        <option value="pending">Pending</option>
        <option value="upcoming">Upcoming</option>
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <!-- DROPDOWN PROGRAM -->
      <select v-model="selectedProgram" class="program-filter-dropdown">
        <option value="">All Programs:</option>
        <option value="BSIT">BSIT</option>
        <option value="BSCS">BSCS</option>
        <option value="BSEMC">BSEMC</option>
      </select>
    </div>

    <div
      class="events-grid"
      :class="{ 'test-grid': filteredEvents.length === 1 }"
    >
      <div
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
            <router-link
              :to="`/AnalyticsOrganizers/${event.id}`"
              class="button-enter"
            >
              Enter
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>

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

  <div class="overlay" v-if="!isMobile && isSidebarOpen"></div>
</template>

<script>
import "vue-cal/dist/vuecal.css";
import VueCal from "vue-cal";
import { QrcodeStream } from "vue-qrcode-reader";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import {
  authService,
  qrService,
  eventService,
  notificationService,
  formatEventForCalendar,
} from "@/api/services";
import NotificationPanel from "@/components/NotificationPanel.vue"; // Import the notification component
import CustomCalendar from "@/components/CustomCalendar.vue"; // Import the calendar component
import axios from "axios";

export default {
  name: "safety",

  components: {
    VueCal,
    QrcodeStream,
    NotificationPanel, // Register the component
    CustomCalendar, // Register the calendar component
  },
  setup() {
    const router = useRouter();
    const searchQuery = ref("");
    const selectedStatus = ref("");
    const selectedProgram = ref("");
    const studentID = ref("");
    const scanType = ref("time_in");
    const timedIDs = new Set();
    const showDropdown = ref(false);
    const showNotifications = ref(false);
    const showLogoutModal = ref(false);
    const isSidebarOpen = ref(false);
    const isOpen = ref(false);
    const isMobile = ref(false);
    const qrData = ref("sample-qr-data");
    const calendarVisible = ref(false);
    const selectedEvent = ref(null);
    const showQRCode = ref(false);
    const useManualInput = ref(false);
    const showCalendarModal = ref(false);
    const notifications = ref([]);
    const notificationLoading = ref(false);
    const unreadCount = ref(0);
    const events = ref([]);
    const allEvents = ref([]); // For calendar display - all events regardless of organizer
    const weather = ref({
      temperature: "",
      description: "",
      icon: "",
    });
    const firstName = ref("");
    const currentTime = ref("");

    // Only show ongoing events in the QR scanner dropdown
    const ongoingEvents = computed(() =>
      events.value.filter(
        (e) => e.status && e.status.toLowerCase() === "ongoing"
      )
    );

    // Fetch events from backend
    const fetchEvents = async () => {
      try {
        const response = await eventService.getEventsOrganizer();
        events.value = response.data;
        console.log("Fetched organizer events:", events.value);
      } catch (err) {
        console.error("Failed to fetch organizer events:", err);
      }
    };

    // Fetch all events for calendar display
    const fetchAllEvents = async () => {
      try {
        console.log("Fetching all events for calendar...");
        const response = await eventService.getAllEvents();
        console.log("Raw API response:", response);

        const eventsData = response.data.data || response.data;
        allEvents.value = Array.isArray(eventsData) ? eventsData : [];

        console.log("Processed events for calendar:", allEvents.value);
        console.log("Number of events:", allEvents.value.length);

        // Log first event for debugging
        if (allEvents.value.length > 0) {
          console.log("Sample event:", allEvents.value[0]);
        }
      } catch (err) {
        console.error("Error fetching all events for calendar:", err);
        console.error("Error details:", err.response?.data);
      }
    };

    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        notificationLoading.value = true;
        console.log(
          "🔔 fetchNotifications called - starting notification fetch"
        );

        // Test if notificationService exists
        if (!notificationService) {
          console.error("❌ notificationService is undefined!");
          return;
        }

        console.log(
          "✅ notificationService exists, calling getNotifications()"
        );
        const response = await notificationService.getNotifications();
        console.log("✅ Notifications response received:", response);

        if (response && response.notifications) {
          notifications.value = response.notifications;
          unreadCount.value = response.unread_count || 0;
          console.log(
            "✅ Notifications loaded:",
            notifications.value.length,
            "notifications"
          );
          console.log("✅ Unread count:", unreadCount.value);
        } else {
          console.error("❌ Invalid response structure:", response);
          notifications.value = [];
          unreadCount.value = 0;
        }
      } catch (error) {
        console.error("❌ Failed to fetch notifications:", error);
        console.error("❌ Error status:", error.response?.status);
        console.error("❌ Error data:", error.response?.data);
        console.error("❌ Error message:", error.message);
        notifications.value = [];
        unreadCount.value = 0;
      } finally {
        notificationLoading.value = false;
        console.log("🔔 fetchNotifications completed");
      }
    };

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const userData = await authService.getUser();
        console.log("🔍 User data from authService:", userData);
        console.log("🔍 Available fields:", Object.keys(userData));

        // Try different possible field names
        const possibleNames = [
          userData.first_name,
          userData.firstName,
          userData.name,
          userData.full_name,
          // Extract first name from full_name if available
          userData.full_name?.split(" ")[0],
          // Extract first name from email if needed
          userData.email?.split("@")[0],
        ];

        console.log("🔍 Possible name values:", possibleNames);

        // Use the first non-undefined value
        firstName.value =
          possibleNames.find((name) => name !== undefined) || "User";

        console.log("✅ User data loaded:", firstName.value);
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
        console.error("❌ Error details:", error.response?.data);
        firstName.value = "User"; // Fallback name
      }
    };

    // Fetch weather data
    const fetchWeather = async () => {
      try {
        // Replace with your actual API key
        const API_KEY = "476431119c6012c1e8cb59bb59fb3668";
        const city = "Olongapo"; // Default city
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error("Weather API request failed");
        }

        const data = await response.json();

        weather.value = {
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          icon: data.weather[0].icon,
        };
      } catch (error) {
        console.error("Error fetching weather:", error);
        // Set default values if weather fetch fails
        weather.value = {
          temperature: "--",
          description: "Weather unavailable",
          icon: "",
        };
      }
    };

    // Handle window resize for mobile detection
    const handleResize = () => {
      isMobile.value = window.innerWidth <= 928;
      if (isMobile.value) {
        isSidebarOpen.value = false;
      }
    };

    onMounted(() => {
      fetchEvents();
      fetchAllEvents();
      fetchNotifications();
      fetchUserData();
      fetchWeather();
      startTimeUpdates();
      handleResize();
      window.addEventListener("resize", handleResize);
    });

    onUnmounted(() => {
      if (timeInterval) {
        clearInterval(timeInterval);
      }
      window.removeEventListener("resize", handleResize);
    });

    // Clean up event listener
    onUnmounted(() => {
      window.removeEventListener("resize", handleResize);
    });

    const filteredEvents = computed(() => {
      return events.value.filter((event) => {
        const matchesSearch =
          (event.event_title?.toLowerCase() || "").includes(
            searchQuery.value.toLowerCase()
          ) ||
          (event.barangay?.toLowerCase() || "").includes(
            searchQuery.value.toLowerCase()
          );

        const matchesStatus =
          selectedStatus.value === "" || event.status === selectedStatus.value;

        const matchesProgram =
          selectedProgram.value === "" ||
          (event.programs && event.programs.includes(selectedProgram.value));

        return matchesSearch && matchesStatus && matchesProgram;
      });
    });

    // Calendar events computed property
    const calendarEvents = computed(() => {
      console.log("Computing calendar events from:", allEvents.value);
      const transformed = allEvents.value
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

    const openCalendarModal = () => {
      showCalendarModal.value = true;
      showDropdown.value = false;
    };

    const closeCalendarModal = () => {
      showCalendarModal.value = false;
    };

    // Update live time
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      // Ensure there's exactly one space before AM/PM
      currentTime.value = timeString.replace(/\s+/g, " ");
    };

    // Start time interval
    let timeInterval;
    const startTimeUpdates = () => {
      updateTime(); // Initial update
      timeInterval = setInterval(updateTime, 1000); // Update every second
    };

    const onDetect = async (result) => {
      try {
        const scannedText = result[0].rawValue;
        const userEmailId = scannedText.split("@")[0];

        if (!userEmailId) {
          throw new Error("Invalid QR code format");
        }

        if (!selectedEvent.value) {
          throw new Error("No event selected");
        }

        const response = await qrService.scanQR(
          selectedEvent.value.id,
          userEmailId,
          scanType.value
        );

        // Update notifications
        await updateNotifications(
          `${
            scanType.value === "time_in" ? "Time In" : "Time Out"
          } recorded for ${selectedEvent.value.event_title}`,
          scanType.value === "time_in"
            ? "volunteer_time_in"
            : "volunteer_time_out"
        );

        alert(
          `${scanType.value === "time_in" ? "Time In" : "Time Out"} recorded: ${
            response.message
          }`
        );
      } catch (error) {
        console.error("QR scan failed:", error);
        alert(
          error.response?.data?.message ||
            error.message ||
            "Failed to process QR code"
        );
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

        const response = await qrService.scanQR(
          selectedEvent.value.id,
          id,
          scanType.value
        );

        // Update notifications
        await updateNotifications(
          `${
            scanType.value === "time_in" ? "Time In" : "Time Out"
          } recorded for ${selectedEvent.value.event_title}`,
          scanType.value === "time_in"
            ? "volunteer_time_in"
            : "volunteer_time_out"
        );

        alert(
          `${scanType.value === "time_in" ? "Time In" : "Time Out"} recorded: ${
            response.message
          }`
        );
        studentID.value = "";
      } catch (error) {
        console.error("Manual ID submission failed:", error);
        alert(
          error.response?.data?.message ||
            error.message ||
            "Failed to process ID"
        );
      }
    };

    const onDateClick = ({ date }) => {
      const selected = allEvents.value.find((event) => {
        const eventDate = new Date(event.date).toLocaleDateString();
        return eventDate === new Date(date).toLocaleDateString();
      });
      selectedEvent.value = selected || null;
    };

    const onEventClick = (event, e) => {
      // Find the original event data from the calendar event
      const originalEvent = allEvents.value.find(
        (evt) => evt.event_title === event.title
      );
      if (originalEvent) {
        selectedEvent.value = originalEvent;
        console.log("Selected event:", originalEvent);
      }
    };

    const toggleNotifications = async () => {
      showNotifications.value = !showNotifications.value;

      // Fetch notifications when opening the panel
      if (showNotifications.value) {
        console.log("🔔 Notification panel opened - fetching notifications");
        await fetchNotifications();
      }
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
        router.push("/LoginOrganizers");
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Failed to logout. Please try again.");
      }
    };

    // Update notification panel after successful scan
    const updateNotifications = async (message, type) => {
      try {
        // Add new notification to the list
        notifications.value.unshift({
          id: Date.now(), // Temporary ID for local notifications
          message,
          type,
          time: "Just now",
          read: false,
        });

        // Keep only the latest 10 notifications
        if (notifications.value.length > 10) {
          notifications.value = notifications.value.slice(0, 10);
        }

        // Update unread count
        unreadCount.value++;
      } catch (error) {
        console.error("Failed to update notifications:", error);
      }
    };

    // Handle notification actions
    const handleMarkAsRead = async (notificationId) => {
      try {
        await notificationService.markAsRead(notificationId);
        // Update local state
        const notification = notifications.value.find(
          (n) => n.id === notificationId
        );
        if (notification && !notification.read) {
          notification.read = true;
          unreadCount.value = Math.max(0, unreadCount.value - 1);
        }
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    };

    const handleMarkAllAsRead = async () => {
      try {
        await notificationService.markAllAsRead();
        // Update local state
        notifications.value.forEach((notification) => {
          notification.read = true;
        });
        unreadCount.value = 0;
      } catch (error) {
        console.error("Failed to mark all notifications as read:", error);
      }
    };

    const handleDeleteNotification = async (notificationId) => {
      try {
        await notificationService.deleteNotification(notificationId);
        // Remove from local state
        const index = notifications.value.findIndex(
          (n) => n.id === notificationId
        );
        if (index !== -1) {
          const notification = notifications.value[index];
          if (!notification.read) {
            unreadCount.value = Math.max(0, unreadCount.value - 1);
          }
          notifications.value.splice(index, 1);
        }
      } catch (error) {
        console.error("Failed to delete notification:", error);
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
      isMobile,
      qrData,
      calendarVisible,
      selectedEvent,
      showQRCode,
      useManualInput,
      notifications,
      notificationLoading,
      unreadCount,
      events,
      allEvents,
      filteredEvents,
      ongoingEvents,
      calendarEvents,
      toggleSidebar,
      toggleDropdown,
      toggleCalendar,
      onDetect,
      onDateClick,
      onEventClick,
      toggleNotifications,
      handleMarkAsRead,
      handleMarkAllAsRead,
      handleDeleteNotification,
      formatTime,
      formatDate,
      confirmLogout,
      submitID,
      fetchEvents,
      fetchAllEvents,
      fetchNotifications,
      handleResize,
      weather,
      firstName,
      showCalendarModal,
      openCalendarModal,
      closeCalendarModal,
      currentTime,
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
