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
      :notifications="notifications"
      :loading="notificationLoading"
      :unreadCount="unreadCount"
      @close="toggleNotifications"
      @mark-as-read="handleMarkAsRead"
      @mark-all-as-read="handleMarkAllAsRead"
      @delete-notification="handleDeleteNotification"
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

          <div class="archived-event-actions">
            <button
              class="enter-analytics-btn"
              @click="viewEventAnalytics(event.id)"
              title="View event analytics"
            >
              <i class="bx bx-bar-chart-alt-2"></i>
              Enter
            </button>
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
  </div>
  <div class="overlay" v-if="!isMobile && isSidebarOpen"></div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import NotificationPanel from "@/components/NotificationPanel.vue"; // Import the notification component
import { useNotifications } from "@/composables/useNotifications";

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

    const selectedProgram = ref("");
    const showLogoutModal = ref(false);
    const isOpen = ref(false);
    const isSidebarOpen = ref(false);
    const searchQuery = ref("");
    const loading = ref(false);
    const error = ref(null);
    const events = ref([]);

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

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
      isOpen.value = !isOpen.value; // optional if you're toggling extra state
    };

    // Fetch archived events using getAllEvents and filter for completed events
    const fetchArchivedEvents = async () => {
      try {
        loading.value = true;
        error.value = null;

        console.log("Fetching all events and filtering for completed ones...");

        // Debug: Check current user
        try {
          const currentUser = await authService.getUser();
          console.log("Current user:", currentUser);
        } catch (err) {
          console.error("Failed to get current user:", err);
        }

        // Use getAllEvents instead of getArchivedEvents to avoid permission issues
        console.log("Making API call to getAllEvents...");
        const response = await eventService.getAllEvents();
        console.log("Raw getAllEvents response:", response);

        // Handle both possible response structures (pagination vs direct array)
        console.log("Response structure:", {
          hasData: !!response.data,
          hasDataData: !!response.data.data,
          dataType: typeof response.data,
          dataDataType: typeof response.data.data,
          isDataArray: Array.isArray(response.data),
          isDataDataArray: Array.isArray(response.data.data),
        });

        let allEvents = [];
        if (Array.isArray(response.data)) {
          // Direct array response (when all=true, no pagination)
          allEvents = response.data;
          console.log("Using direct array data:", allEvents.length, "events");
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Paginated response
          allEvents = response.data.data;
          console.log("Using paginated data:", allEvents.length, "events");
        } else {
          console.error("Unexpected response structure:", response.data);
          allEvents = [];
        }

        // Debug: Log all events and their statuses
        console.log("All events from API:", allEvents);
        console.log(
          "Event statuses:",
          allEvents.map((event) => ({
            id: event.id,
            title: event.event_title,
            status: event.status,
            status_type: typeof event.status,
          }))
        );

        // Filter for completed events only
        const completedEvents = allEvents.filter((event) => {
          const isCompleted =
            event.status && event.status.toLowerCase() === "completed";
          console.log(
            `Event "${event.event_title}" - Status: "${event.status}" - Is Completed: ${isCompleted}`
          );
          return isCompleted;
        });

        events.value = completedEvents;
        console.log(
          "Archived events loaded:",
          events.value.length,
          "completed events"
        );
        console.log("Completed events:", completedEvents);
      } catch (err) {
        console.error("Error fetching archived events:", err);
        error.value =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch archived events";
        events.value = []; // Ensure events is an array even on error
      } finally {
        loading.value = false;
      }
    };

    /* VIEW EVENT ANALYTICS */
    const viewEventAnalytics = (eventId) => {
      console.log("🔍 Navigating to analytics for archived event ID:", eventId);
      router.push(`/AnalyticsOrganizers/${eventId}`);
    };

    /* DELETE ARCHIVED EVENT */
    const deleteEvent = async (eventId, index) => {
      const confirmed = confirm(
        "Do you want to permanently delete this archived event?"
      );
      if (confirmed) {
        try {
          loading.value = true;
          console.log("🗑️ Attempting to delete event ID:", eventId);
          await eventService.deleteEvent(eventId);
          events.value.splice(index, 1);
          console.log("✅ Event deleted successfully!");
          alert("Event deleted successfully!");
        } catch (err) {
          console.error("❌ Failed to delete event:", err);
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
      // Notification functionality
      notifications,
      notificationLoading,
      unreadCount,
      showNotifications,
      toggleNotifications,
      handleMarkAsRead,
      handleMarkAllAsRead,
      handleDeleteNotification,
      // Other functionality
      showLogoutModal,
      selectedProgram,
      isOpen,
      isSidebarOpen,
      searchQuery,
      loading,
      error,
      events,
      filteredEvents,
      toggleSidebar,
      fetchArchivedEvents,
      viewEventAnalytics, // view event analytics
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
  font-size: 14px;
  margin-bottom: 5px;
}

/* Action buttons container */
.archived-event-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
  margin-right: 10px;
}

/* Enter Analytics Button */
.enter-analytics-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #435739, #6b8a4f);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(67, 87, 57, 0.3);
}

.enter-analytics-btn:hover {
  background: linear-gradient(135deg, #6b8a4f, #81a263);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 87, 57, 0.4);
}

.enter-analytics-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(67, 87, 57, 0.3);
}

.enter-analytics-btn i {
  font-size: 16px;
}

/* Delete button enhancement */
#delete-button {
  font-size: 20px;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;
}

#delete-button:hover {
  color: #dc3545;
}

/* Responsive design for action buttons */
@media (max-width: 768px) {
  .archived-event-actions {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .enter-analytics-btn {
    justify-content: center;
    padding: 10px 16px;
    font-size: 14px;
  }

  #delete-button {
    align-self: center;
    font-size: 18px;
  }
}
</style>
