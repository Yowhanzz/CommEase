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
        EVENT HISTORY
      </h1>
      <input
        v-model="searchQuery"
        class="input-search-event"
        type="search"
        placeholder="Search event..."
      />
    </div>
    <hr class="hr-input" :class="{ 'sidebar-collapsed-for-divider': isOpen }" />

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
          </tr>
        </thead>
        <tbody>
          <tr v-for="(event, index) in filteredEvents" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ event.title }}</td>
            <td>{{ event.barangay }}</td>
            <td>{{ event.date }}</td>
            <td>{{ event.time }}</td>
            <td>{{ event.organizer }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="overlay" v-if="!isMobile && isSidebarOpen"></div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const showNotifications = ref(false);
    const showLogoutModal = ref(false);
    const isOpen = ref(false);
    const isSidebarOpen = ref(false);
    const searchQuery = ref("");
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
    const events = ref([
      {
        title: "Clean Up Drive",
        barangay: "East Bajac - Bajac",
        date: "08/06/2025",
        time: "10:00 - 12:00",
        organizer: "ELITES",
        status: "Pending",
      },
      {
        title: "Tree Planting",
        barangay: "West Bajac - Bajac",
        date: "09/10/2025",
        time: "8:00 - 10:00",
        organizer: "GREEN INITIATIVE",
        status: "Pending",
      },
      {
        title: "Feeding Program",
        barangay: "North Bajac - Bajac",
        date: "10/12/2025",
        time: "2:00 - 4:00",
        organizer: "HELPING HANDS",
        status: "Pending",
      },
      {
        title: "Blood Donation",
        barangay: "South Bajac - Bajac",
        date: "12/15/2025",
        time: "9:00 - 1:00",
        organizer: "HEALTH TEAM",
        status: "Pending",
      },
    ]);

    const filteredEvents = computed(() => {
      const query = searchQuery.value.toLowerCase();
      return events.value.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.barangay.toLowerCase().includes(query) ||
          event.date.toLowerCase().includes(query) ||
          event.time.toLowerCase().includes(query) ||
          event.organizer.toLowerCase().includes(query)
      );
    });

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
      isOpen.value = !isOpen.value; // optional if you're toggling extra state
    };

    const confirmLogout = () => {
      showLogoutModal.value = false;
      authService.logout()
        .then(() => {
          // Clear any local storage or state
          localStorage.clear();
          // Redirect to login page
          router.push('/LoginOrganizers');
        })
        .catch((error) => {
          console.error('Logout failed:', error);
          // Even if the API call fails, we should still redirect to login
          router.push('/LoginOrganizers');
        });
    };

    return {
      showNotifications,
      showLogoutModal,
      isOpen,
      isSidebarOpen,
      searchQuery,
      notifications,
      events,
      filteredEvents,
      toggleNotifications,
      toggleSidebar,
      confirmLogout,
    };
  },
};
</script>

<style scoped src="/src/assets/CSS Organizers/ActivityLog.css"></style>
