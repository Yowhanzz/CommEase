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
  <div class="container-table"  :class="{ 'sidebar-collapsed': !isOpen }">
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
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through the 'events' array -->
        <tr v-for="(event, index) in filteredEvents" :key="index">
          <td data-label="Id">{{ index + 1 }}</td>
          <td data-label="Event Name">{{ event.event_title }}</td>
          <td data-label="Time">{{ event.barangay }}</td>
          <td data-label="Date">{{ event.date }}</td>
          <td data-label="Time">{{ `${event.start_time} - ${event.end_time}` }}</td>
          <td data-label="Organizer">{{ event.organizer }}</td>
          <td>{{ (event.programs || []).join(', ') }}</td>

          <td>
            <span
              :class="{
                'status-pending': event.status === 'Pending',
                'status-active': event.status === 'Active',
                'status-completed': event.status === 'Completed',
              }"
            >
              {{ event.status }}
            </span>
          </td>
          <td data-label="Action" class="action-button">
            <div class="test">
            <button class="entries-edit" @click="handleEdit(event)">Edit</button>
            <button class="entries-edit" @click="handleDelete(event.id)">Delete</button>
            </div>
          </td>
        </tr>
        <!-- Show placeholder if 'events' is empty -->
        <tr v-if="events.length === 0">
          <td colspan="8" class="no-data">No events available</td>
        </tr>
      </tbody>
    </table>
  </div>
  </div>

  <div class="overlay" v-if="!isMobile && isSidebarOpen"></div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showNotifications = ref(false);
const showLogoutModal = ref(false);
const isOpen = ref(false);
const isSidebarOpen = ref(false);
const searchQuery = ref("");
const loading = ref(false);
const error = ref(null);
const events = ref([]);

const notifications = ref([
  { message: "You completed the 'Update website content' task.", time: "2 hours ago" },
  { message: "You completed the 'Clean up drive' task.", time: "3 hours ago" },
  { message: "You completed the 'Meeting with organizers' task.", time: "5 hours ago" },
]);

const filteredEvents = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return events.value.filter(event =>
    event.event_title.toLowerCase().includes(query) ||
    event.barangay.toLowerCase().includes(query) ||
    event.date.toLowerCase().includes(query) ||
    `${event.start_time} - ${event.end_time}`.toLowerCase().includes(query) ||
    event.organizer?.toLowerCase().includes(query) ||
    event.status.toLowerCase().includes(query)
  );
});

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  isOpen.value = !isOpen.value;
};

const confirmLogout = async () => {
  try {
    await authService.logout();
    router.push('/LoginOrganizers');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

const handleEdit = (event) => {
  router.push({
    name: 'EditEventOrganizers',
    params: { id: event.id }
  });
};

const handleDelete = async (eventId) => {
  if (confirm("Are you sure you want to delete this event?")) {
    try {
      loading.value = true;
      error.value = null;
      await eventService.deleteEvent(eventId);
      events.value = events.value.filter(event => event.id !== eventId);
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to delete event';
    } finally {
      loading.value = false;
    }
  }
};

const fetchEvents = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await eventService.getEvents();
    events.value = response.data.data;
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Failed to fetch events';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchEvents();
});
</script>

<style scoped src="/src/assets/CSS Organizers/Manage-events.css"></style>
