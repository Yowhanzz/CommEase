<template>
  <div>
    <!-- Sidebar -->
    <header>
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
        MANAGE EVENTS
      </h1>
      <input
        v-model="searchQuery"
        class="input-search-event"
        type="search"
        placeholder="Search event..."
      />
    </div>
    <hr class="hr-input" :class="{ 'sidebar-collapsed-for-divider': isOpen }" />

    <router-link to="/CreateEventOrganizers" class="create-event-button"
      >Create Event</router-link
    >

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
            <th>Programs</th>
            <th>Participants</th>
            <th>Status</th>
            <th>Action</th>
            <th>Event Control</th>
          </tr>
        </thead>
        <tbody>
          <!-- Loop through the 'events' array -->
          <tr v-for="(event, index) in filteredEvents" :key="index">
            <td data-label="Id">{{ index + 1 }}</td>
            <td data-label="Event Name">{{ event.event_title }}</td>
            <td data-label="Time">{{ event.barangay }}</td>
            <td data-label="Date">{{ formatDateFn(event.date) }}</td>
            <td data-label="Time">
              {{ formatTimeFn(event.start_time) }} -
              {{ formatTimeFn(event.end_time) }}
            </td>
            <td data-label="Organizer">
              {{ event.organizer?.first_name }} {{ event.organizer?.last_name }}
            </td>
            <td>{{ (event.programs || []).join(", ") }}</td>
            <td data-label="Participants" class="participants-cell">
              <div class="participant-info">
                <div class="participant-numbers">
                  <span class="registered">{{
                    event.registered_count || 0
                  }}</span>
                  <span class="separator">/</span>
                  <span class="limit">{{ event.participant_limit || 0 }}</span>
                </div>
                <div
                  class="participant-target"
                  v-if="event.target_participants"
                >
                  Target: {{ event.target_participants }}
                </div>
                <div class="progress-bar" v-if="event.participant_limit">
                  <div
                    class="progress-fill"
                    :style="{
                      width: `${Math.min(
                        ((event.registered_count || 0) /
                          event.participant_limit) *
                          100,
                        100
                      )}%`,
                      backgroundColor:
                        (event.registered_count || 0) >=
                        (event.target_participants || 0)
                          ? '#81a263'
                          : '#ffc107',
                    }"
                  ></div>
                </div>
                <div class="participant-status">
                  <span v-if="event.is_full" class="status-full">FULL</span>
                  <span v-else-if="event.target_reached" class="status-target"
                    >TARGET REACHED</span
                  >
                  <span v-else class="status-open"
                    >{{ event.available_slots || 0 }} slots left</span
                  >
                </div>
              </div>
            </td>
            <td>
              <span
                :class="{
                  'status-pending': event.status === 'pending',
                  'status-active': event.status === 'active',
                  'status-completed': event.status === 'completed',
                }"
              >
                {{
                  event.status.charAt(0).toUpperCase() + event.status.slice(1)
                }}
              </span>
            </td>
            <td data-label="Action" class="action-button">
              <div class="test">
                <button class="entries-edit" @click="handleEdit(event)">
                  Edit
                </button>
                <button class="entries-edit" @click="handleDelete(event.id)">
                  Delete
                </button>
              </div>
            </td>
            <td data-label="Event Control" class="event-control">
              <div class="test">
                <button
                  v-if="
                    ['pending', 'upcoming'].includes(event.status.toLowerCase())
                  "
                  class="start-btn"
                  @click="handleStartEvent(event.id)"
                >
                  Start
                </button>
                <button
                  v-else-if="event.status.toLowerCase() === 'ongoing'"
                  class="end-btn"
                  @click="handleEndEvent(event.id)"
                >
                  End
                </button>
                <span v-else class="event-status">
                  {{
                    event.status.charAt(0).toUpperCase() + event.status.slice(1)
                  }}
                </span>
              </div>
            </td>
          </tr>
          <!-- Show placeholder if 'events' is empty -->
          <tr v-if="events.length === 0">
            <td colspan="11" class="no-data">No events available</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="overlay" v-if="!isMobile && isSidebarOpen"></div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import NotificationPanel from "@/components/NotificationPanel.vue"; // Import the notification component

import { useRouter } from "vue-router";
import {
  eventService,
  authService,
  formatTime,
  formatDate,
} from "../api/services";
import { useNotifications } from "@/composables/useNotifications";

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

const showLogoutModal = ref(false);
const isOpen = ref(false);
const isSidebarOpen = ref(false);
const searchQuery = ref("");
const loading = ref(false);
const error = ref(null);
const events = ref([]);
const isMobile = ref(false);

// Expose the formatting functions
const formatTimeFn = formatTime;
const formatDateFn = formatDate;

const filteredEvents = computed(() => {
  if (!Array.isArray(events.value)) {
    return [];
  }
  const query = searchQuery.value.toLowerCase();
  return events.value.filter(
    (event) =>
      event.event_title?.toLowerCase().includes(query) ||
      event.barangay?.toLowerCase().includes(query) ||
      formatDateFn(event.date)?.toLowerCase().includes(query) ||
      `${formatTimeFn(event.start_time)} - ${formatTimeFn(event.end_time)}`
        .toLowerCase()
        .includes(query) ||
      `${event.organizer?.first_name} ${event.organizer?.last_name}`
        .toLowerCase()
        .includes(query)
  );
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  isOpen.value = !isOpen.value;
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

const handleEdit = (event) => {
  router.push({
    name: "EditEventOrganizers",
    params: { id: event.id },
  });
};

const handleDelete = async (eventId) => {
  if (confirm("Are you sure you want to delete this event?")) {
    try {
      loading.value = true;
      error.value = null;
      await eventService.deleteEvent(eventId);
      events.value = events.value.filter((event) => event.id !== eventId);
    } catch (err) {
      error.value =
        err.response?.data?.message || err.message || "Failed to delete event";
    } finally {
      loading.value = false;
    }
  }
};

const handleStartEvent = async (eventId) => {
  try {
    loading.value = true;
    error.value = null;
    await eventService.startEvent(eventId);
    // Update the event status in the local events array
    events.value = events.value.map((event) =>
      event.id === eventId ? { ...event, status: "ongoing" } : event
    );
  } catch (err) {
    error.value =
      err.response?.data?.message || err.message || "Failed to start event";
    console.error("Start event failed:", err);
  } finally {
    loading.value = false;
  }
};

const handleEndEvent = async (eventId) => {
  try {
    loading.value = true;
    error.value = null;
    await eventService.endEvent(eventId);
    events.value = events.value.map((event) =>
      event.id === eventId ? { ...event, status: "completed" } : event
    );
  } catch (err) {
    error.value =
      err.response?.data?.message || err.message || "Failed to end event";
  } finally {
    loading.value = false;
  }
};

const fetchEvents = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await eventService.getEventsOrganizer();
    // Handle both possible response structures
    const eventsData = response.data.data || response.data;
    events.value = Array.isArray(eventsData) ? eventsData : [];
    console.log("Events data:", events.value); // Debug log
  } catch (err) {
    error.value =
      err.response?.data?.message || err.message || "Failed to fetch events";
    events.value = []; // Ensure events is an array even on error
  } finally {
    loading.value = false;
  }
};

const handleResize = () => {
  isMobile.value = window.innerWidth <= 928;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
  fetchEvents();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
name: "safety", components: { QrcodeStream, VueCal, VueQrcode,
NotificationPanel, // Register the component },

<style scoped src="/src/assets/CSS Organizers/Manage-events.css"></style>

<style scoped>
.event-control {
  text-align: center;
}

.start-btn,
.end-btn {
  padding: 10px 9px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  font-size: 14px;
  font-weight: 500;
}

.start-btn {
  background-color: #81a263;
  color: white;
}

.start-btn:hover {
  background: transparent;
  color: #81a263;
  border: 2px solid #81a263;
}

.end-btn {
  background-color: #ae0707;
  color: white;
}

.end-btn:hover {
  background: transparent;
  color: #ae0707;
  border: 2px solid #ae0707;
}

.event-status {
  color: #6c757d;
  font-style: italic;
}

.start-btn:disabled,
.end-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

/* Participant Progress Styles */
.participants-cell {
  min-width: 150px;
}

.participant-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.participant-numbers {
  font-weight: 600;
  font-size: 16px;
}

.registered {
  color: #435739;
}

.separator {
  color: #6c757d;
  margin: 0 2px;
}

.limit {
  color: #6c757d;
}

.participant-target {
  font-size: 12px;
  color: #6c757d;
  font-style: italic;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 3px;
}

.participant-status {
  font-size: 11px;
  font-weight: 500;
}

.status-full {
  color: #dc3545;
  font-weight: 600;
}

.status-target {
  color: #28a745;
  font-weight: 600;
}

.status-open {
  color: #6c757d;
}
</style>
