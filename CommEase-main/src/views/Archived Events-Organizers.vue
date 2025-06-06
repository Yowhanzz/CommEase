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
              <span class="nav-item" v-show="isSidebarOpen"
                >Archived Events</span
              >
            </router-link>
          </li>
          <li>
            <router-link to="/ActivityLogOrganizers">
              <i class="bx bx-file report"></i>
              <span class="nav-item" v-show="isSidebarOpen"
                >Attendance Report</span
              >
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

    <!-- NOTIFICATION COMPONENT -->
    <NotificationPanel
      :isOpen="showNotifications"
      @close="toggleNotifications"
    />

    <!-- OVERLAY -->
    <div
      class="overlay"
      v-if="showNotifications"
      @click="toggleNotifications"
    ></div>

    <!-- ACTIVITY LOG HEADER -->
    <div class="header-container" :class="{ 'sidebar-collapsed': !isOpen }">
      <h1 class="lists-events" :class="{ 'header-closed': isOpen }">
        ARCHIVED EVENTS
      </h1>
      <input
        v-model="searchQuery"
        class="input-search-event"
        type="search"
        placeholder="Search event..."
      />
    </div>
    <hr class="hr-input" :class="{ 'sidebar-collapsed-for-divider': isOpen }" />
  </div>

  <!-- ARCHIVED EVENTS SECTION -->

  <div class="test">
    <div class="dropdown-filter" :class="{ 'sidebar-collapsed': !isOpen }">
      <select v-model="selectedProgram" class="program-filter-dropdown">
        <option value="">All Programs:</option>
        <option value="BSIT">BSIT</option>
        <option value="BSCS">BSCS</option>
        <option value="BSEMC">BSEMC</option>
      </select>
    </div>

    <div class="archived-whole" :class="{ 'sidebar-collapsed': !isOpen }">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <p>Loading archived events...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <p class="error-message">{{ error }}</p>
        <button @click="fetchArchivedEvents" class="retry-btn">Retry</button>
      </div>

      <!-- Events List -->
      <div v-else class="archived-events-separation">
        <!-- No Events Message -->
        <div v-if="filteredEvents.length === 0" class="no-events-container">
          <p>No archived events found.</p>
        </div>

        <!-- Events Cards -->
        <div
          class="archived-container"
          v-for="(event, index) in filteredEvents"
          :key="event.id"
        >
          <div class="archived-contents-separation">
            <div class="green-vertical"></div>

            <div class="archived-contents">
              <h3 class="archived-event-title">{{ event.event_title }}</h3>

              <p class="archived-event-barangay">
                <span><b>Barangay:</b></span> {{ event.barangay }}
              </p>
              <p class="archived-event-organizer">
                <span><b>Organizer:</b></span>
                {{ event.organizer?.first_name }}
                {{ event.organizer?.last_name }}
              </p>
              <p class="archived-event-date">
                <span><b>Date:</b></span> {{ formatDate(event.date) }}
              </p>
              <p class="archived-event-time">
                <span><b>Time:</b></span>
                {{ formatTime(event.start_time) }} -
                {{ formatTime(event.end_time) }}
              </p>
              <p class="archived-event-participants">
                <span><b>Participants:</b></span>
                {{ event.registered_count || 0 }}/{{
                  event.participant_limit || 0
                }}
              </p>
              <span class="archived-event-programs">
                <span><b>Programs:</b></span>
                {{ (event.programs || []).join(", ") }}
              </span>
            </div>
          </div>

          <i
            class="bx bx-trash"
            id="delete-button"
            @click="deleteEvent(event.id, index)"
            title="Delete archived event"
          ></i>
        </div>
      </div>
    </div>
  </div>
  <div class="overlay" v-if="!isMobile && isSidebarOpen"></div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  authService,
  eventService,
  formatTime,
  formatDate,
} from "@/api/services";

export default {
  name: "safety",

  components: {
    NotificationPanel, // Register the component
  },
  setup() {
    const router = useRouter();
    const selectedProgram = ref("");
    const showNotifications = ref(false);
    const showLogoutModal = ref(false);
    const isOpen = ref(false);
    const isSidebarOpen = ref(false);
    const searchQuery = ref("");
    const loading = ref(false);
    const error = ref(null);
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
      let filtered = events.value.filter(
        (event) =>
          event.event_title?.toLowerCase().includes(query) ||
          event.barangay?.toLowerCase().includes(query) ||
          formatDate(event.date)?.toLowerCase().includes(query) ||
          `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`
            .toLowerCase()
            .includes(query) ||
          `${event.organizer?.first_name} ${event.organizer?.last_name}`
            .toLowerCase()
            .includes(query)
      );

      // Filter by program if selected
      if (selectedProgram.value) {
        filtered = filtered.filter((event) =>
          event.programs?.includes(selectedProgram.value)
        );
      }

      return filtered;
    });

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
      isOpen.value = !isOpen.value; // optional if you're toggling extra state
    };

    // Fetch archived events from API
    const fetchArchivedEvents = async () => {
      try {
        loading.value = true;
        error.value = null;

        // Debug: Check current user authentication and role
        console.log("Checking user authentication...");
        try {
          const user = await authService.getUser();
          console.log("Current user:", user);
          console.log("User role:", user.role);
          console.log("User role type:", typeof user.role);
          console.log("User role length:", user.role?.length);
          console.log("User role exact value:", JSON.stringify(user.role));

          if (user.role !== "organizer") {
            error.value = `Access denied. Current role: "${
              user.role
            }" (type: ${typeof user.role}). Expected: "organizer"`;
            return;
          }

          // Test if regular events route works
          console.log("Testing regular events route...");
          const testResponse = await eventService.getEventsOrganizer();
          console.log(
            "Regular events route works:",
            testResponse.data.length,
            "events"
          );
        } catch (authError) {
          console.error("Authentication check failed:", authError);
          error.value = "Authentication failed. Please log in again.";
          return;
        }

        console.log("Fetching archived events...");
        const response = await eventService.getArchivedEvents();
        // Handle both possible response structures
        const eventsData = response.data.data || response.data;
        events.value = Array.isArray(eventsData) ? eventsData : [];
        console.log("Archived events loaded:", events.value.length, "events");
      } catch (err) {
        console.error("Error details:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });

        if (err.response?.status === 404) {
          error.value = "Archived events route not found.";
        } else if (err.response?.status === 401) {
          error.value = "You are not authenticated. Please log in again.";
        } else if (err.response?.status === 403) {
          const errorMsg = err.response?.data?.message || "Access forbidden";
          error.value = `Access denied: ${errorMsg}. Please ensure you're logged in as an organizer.`;
        } else {
          error.value =
            err.response?.data?.message ||
            err.message ||
            "Failed to fetch archived events";
        }
        events.value = []; // Ensure events is an array even on error
      } finally {
        loading.value = false;
      }
    };

    /* DELETE ARCHIVED EVENT */
    const deleteEvent = async (eventId, index) => {
      const confirmed = confirm(
        "Do you want to permanently delete this archived event?"
      );
      if (confirmed) {
        try {
          loading.value = true;
          await eventService.deleteEvent(eventId);
          events.value.splice(index, 1);
          alert("Event deleted successfully!");
        } catch (err) {
          error.value =
            err.response?.data?.message ||
            err.message ||
            "Failed to delete event";
          alert("Failed to delete event. Please try again.");
        } finally {
          loading.value = false;
        }
      }
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

    // Load archived events when component mounts
    onMounted(() => {
      fetchArchivedEvents();
    });

    return {
      showNotifications,
      showLogoutModal,
      selectedProgram,
      isOpen,
      isSidebarOpen,
      searchQuery,
      loading,
      error,
      notifications,
      events,
      filteredEvents,
      toggleNotifications,
      toggleSidebar,
      fetchArchivedEvents,
      deleteEvent, //delete archived event
      confirmLogout,
      formatTime,
      formatDate,
    };
  },
};
</script>

<style scoped src="/src/assets/CSS Organizers/archived.css"></style>

<style scoped>
/* Loading, Error, and No Events States */
.loading-container,
.error-container,
.no-events-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  min-height: 200px;
}

.loading-container p {
  font-size: 18px;
  color: #435739;
  font-weight: 500;
}

.error-container {
  color: #dc3545;
}

.error-message {
  font-size: 16px;
  margin-bottom: 15px;
  font-weight: 500;
}

.retry-btn {
  background-color: #435739;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.retry-btn:hover {
  background-color: #2d3d26;
}

.no-events-container p {
  font-size: 16px;
  color: #6c757d;
  font-style: italic;
}

/* Enhanced archived event participants info */
.archived-event-participants {
  color: #435739;
  font-size: 14px;
  margin-bottom: 5px;
}

.archived-event-participants span {
  font-weight: 600;
}

/* Delete button enhancement */
#delete-button {
  transition: color 0.3s ease, transform 0.2s ease;
}

#delete-button:hover {
  color: #dc3545;
  transform: scale(1.1);
}
</style>
