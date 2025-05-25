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
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <!-- Loop through the 'events' array -->
          <tr v-for="(event, index) in filteredEvents" :key="index">
            <td data-label="Id">{{ index + 1 }}</td>
            <td data-label="Event Name">{{ event.title }}</td>
            <td data-label="Time">{{ event.barangay }}, Olongapo City</td>
            <td data-label="Date">{{ event.date }}</td>
            <td data-label="Time">{{ event.time }}</td>
            <td data-label="Organizer">{{ event.organizer }}</td>
            <td>{{ (event.programs || []).join(", ") }}</td>

            <td>
              <span
                :class="{
                  'status-pending': event.event_status === 'Pending',
                  'status-active': event.event_status === 'Active',
                  'status-completed': event.event_status === 'Completed',
                }"
              >
                {{ event.status }}
              </span>
            </td>
            <td data-label="Action" class="action-button">
              <div class="test">
                <button class="entries-edit" @click="handleEdit(event)">
                  Edit
                </button>
                <button
                  class="entries-delete"
                  @click="handleDelete(event.event_id)"
                >
                  Delete
                </button>
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

<script>
export default {
  data() {
    return {
      // UI Toggles
      showNotifications: false,
      showLogoutModal: false,
      isOpen: false,
      isSidebarOpen: false,

      //
      isMobile: false,

      // Search
      searchQuery: "",

      // Notifications
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

      // Events
      events: [
        {
          event_id: 1,
          title: "Clean Up Drive",
          barangay: "East Bajac - Bajac",
          date: "08/06/2025",
          time: "10:00 - 12:00",
          organizer: "ELITES",
          status: "Pending",
        },
        {
          event_id: 2,
          title: "Tree Planting",
          barangay: "West Bajac - Bajac",
          date: "09/10/2025",
          time: "8:00 - 10:00",
          organizer: "GREEN INITIATIVE",
          status: "Pending",
        },
        {
          event_id: 3,
          title: "Feeding Program",
          barangay: "North Bajac - Bajac",
          date: "10/12/2025",
          time: "2:00 - 4:00",
          organizer: "HELPING HANDS",
          status: "Pending",
        },
        {
          event_id: 4,
          title: "Blood Donation",
          barangay: "South Bajac - Bajac",
          date: "12/15/2025",
          time: "9:00 - 1:00",
          organizer: "HEALTH TEAM",
          status: "Pending",
        },
      ],
    };
  },

  computed: {
    filteredEvents() {
      const query = this.searchQuery.toLowerCase();
      return this.events.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.barangay.toLowerCase().includes(query) ||
          event.date.toLowerCase().includes(query) ||
          event.time.toLowerCase().includes(query) ||
          event.organizer.toLowerCase().includes(query) ||
          event.status.toLowerCase().includes(query)
      );
    },
  },

  mounted() {
    const storedEvents = JSON.parse(localStorage.getItem("events"));

    if (storedEvents !== null) {
      this.events = storedEvents;
    } else {
      // Only set default events on first load (when there's no events key at all)
      localStorage.setItem("events", JSON.stringify(this.events));
    }
  },

  methods: {
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },

    handleResize() {
      /* ADDED */
      this.isMobile = window.innerWidth <= 928;
      if (this.isMobile) {
        this.isSidebarOpen = false;
      }
    },

    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
      this.isOpen = !this.isOpen; // optional extra toggle state
    },

    confirmLogout() {
      this.$router.push("/LoginOrganizers");
    },

    handleEdit(event) {
      const [startTime, endTime] = event.time.split(" - ");
      this.$router.push({
        path: "/EditEventOrganizers",
        query: {
          event_id: event.event_id,
          title: event.title,
          barangay: event.barangay,
          date: event.date,
          startTime,
          endTime,
          organizer: event.organizer,
          status: event.status,
        },
      });
    },

    handleDelete(eventId) {
      if (confirm("Are you sure you want to delete this event?")) {
        this.events = this.events.filter((e) => e.event_id !== eventId);
        localStorage.setItem("events", JSON.stringify(this.events));
        alert("Event deleted successfully!");
      }
    },

    saveEvent(newEvent) {
      // Check if updating existing event
      const index = this.events.findIndex(
        (e) => e.event_id === newEvent.event_id
      );
      if (index !== -1) {
        this.events.splice(index, 1, newEvent);
      } else {
        // New event, assign new id
        newEvent.event_id = this.events.length
          ? Math.max(...this.events.map((e) => e.event_id)) + 1
          : 1;
        this.events.push(newEvent);
      }
      localStorage.setItem("events", JSON.stringify(this.events));
      alert("Event saved successfully!");
    },

    onSubmitEvent() {
      const newEvent = {
        event_id: null, // or existing id if editing
        title: this.title,
        barangay: this.barangay,
        date: this.date, // format: YYYY-MM-DD or your format
        time: `${this.startTime} - ${this.endTime}`,
        organizer: this.organizer,
        status: "Pending",
      };
      this.saveEvent(newEvent);
    },
  },
};
</script>

<style scoped src="/src/assets/CSS Organizers/Manage-events.css"></style>
