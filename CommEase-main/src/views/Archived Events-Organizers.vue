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
      <div class="archived-events-separation">
        <div
          class="archived-container"
          v-for="(event, index) in filteredEvents"
          :key="index"
        >
          <div class="archived-contents-separation">
            <div class="green-vertical"></div>

            <div class="archived-contents">
              <h3 class="archived-event-title">{{ event.title }}</h3>

              <p class="archived-event-barangay">
                <span><b>Barangay:</b></span> {{ event.barangay }}
              </p>
              <p class="archived-event-organizer">
                <span><b>Organizer:</b></span> {{ event.organizer }}
              </p>
              <p class="archived-event-date">
                <span><b>Date:</b></span> {{ event.date }}
              </p>
              <p class="archived-event-time">
                <span><b>Time:</b></span> {{ event.time }}
              </p>
              <span class="archived-event-programs"
                ><span><b>Programs:</b></span> {{ event.programs }}</span
              >
            </div>
          </div>

          <i
            class="bx bx-trash"
            id="delete-button"
            @click="deleteEvent(index)"
          ></i>
        </div>
      </div>
    </div>
  </div>
  <div class="overlay" v-if="!isMobile && isSidebarOpen"></div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { authService } from "@/api/services";

export default {
  setup() {
    const router = useRouter();
    const selectedProgram = ref("");
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
        programs: "BSIT, BSCS",
        status: "Pending",
      },
      {
        title: "Tree Planting",
        barangay: "West Bajac - Bajac",
        date: "09/10/2025",
        time: "8:00 - 10:00",
        organizer: "GREEN INITIATIVE",
        programs: "BSIT",
        status: "Pending",
      },
      {
        title: "Feeding Program",
        barangay: "North Bajac - Bajac",
        date: "10/12/2025",
        time: "2:00 - 4:00",
        organizer: "HELPING HANDS",
        programs: "BSIT, BSCS",
        status: "Pending",
      },
      {
        title: "Blood Donation",
        barangay: "South Bajac - Bajac",
        date: "12/15/2025",
        time: "9:00 - 1:00",
        organizer: "HEALTH TEAM",
        programs: "BSIT, BSEMC",
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

      /* MAY PROGRAM FILTER */
    });

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
      isOpen.value = !isOpen.value; // optional if you're toggling extra state
    };

    /* DELETE ARCHIVED EVENT */
    const deleteEvent = (index) => {
      const confirmed = confirm("Do you want to remove this in your archived?");
      if (confirmed) {
        alert("Removed Successfully!");
        events.value.splice(index, 1);
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

    return {
      showNotifications,
      showLogoutModal,
      selectedProgram,
      isOpen,
      isSidebarOpen,
      searchQuery,
      notifications,
      events,
      filteredEvents,
      toggleNotifications,
      toggleSidebar,
      deleteEvent, //delete archived event
      confirmLogout,
    };
  },
};
</script>

<style scoped src="/src/assets/CSS Organizers/archived.css"></style>
