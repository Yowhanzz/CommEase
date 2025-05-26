<template>
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

  <!-- ANALYTICS SECTION -->
  <div class="title-sidebar">
    <h1 class="analytics-title" :class="{ 'sidebar-collapsed': !isOpen }">
      Event Analytics
    </h1>
    <hr class="hr-input" :class="{ 'sidebar-collapsed-for-divider': isOpen }" />
  </div>

  <!-- TOTAL ANALYTICS SECTION -->
  <div class="analytics-siebar" :class="{ 'sidebar-collapsed': !isOpen }">
    <div class="total-analytics-container">
      <div class="total-analytics-separation">
        <div class="total-container">
          <h5 class="title-total">Total Volunteers</h5>
          <p class="total-no">60</p>
        </div>
        <div class="total-container">
          <h5 class="title-total">Time Event Duration</h5>
          <p class="total-no">2hrs 20m</p>
        </div>
        <div class="total-container">
          <h5 class="title-total">Total of Attendees</h5>
          <p class="total-no">50</p>
        </div>
        <div class="total-container">
          <h5 class="title-total">Total of Non-Attendees</h5>
          <p class="total-no">10</p>
        </div>
      </div>
    </div>

    <!-- registrationForm -->
    <!-- :registraion="registrationForm" -->

    <!-- GRAPH SECTION -->
    <div class="total-graph-container">
      <div class="total-graph-separation">
        <div class="total-graph-glasscard">
          <h5 class="title-graph">Time Rate for Volunteers</h5>
          <BarChart />
        </div>

        <div class="total-pie-graph-glasscard">
          <h5 class="title-graph">Total no. of volunteers</h5>
          <PieChart />
        </div>

        <div class="total-graph-glasscard">
          <h5 class="title-graph">Time in & out of Volunteers</h5>
          <div class="container-table">
            <table class="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Time-In</th>
                  <th>Time-Out</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Bogart</td>
                  <td>10:00</td>
                  <td>12:00</td>
                </tr>
                <tr>
                  <td>Bogart</td>
                  <td>10:00</td>
                  <td>12:00</td>
                </tr>
                <tr>
                  <td>Bogart</td>
                  <td>10:00</td>
                  <td>12:00</td>
                </tr>
                <tr>
                  <td>Bogart</td>
                  <td>10:00</td>
                  <td>12:00</td>
                </tr>
                <tr>
                  <td>Bogart</td>
                  <td>10:00</td>
                  <td>12:00</td>
                </tr>
                <tr>
                  <td>Bogart</td>
                  <td>10:00</td>
                  <td>12:00</td>
                </tr>
                <tr>
                  <td>Bogart</td>
                  <td>10:00</td>
                  <td>12:00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="total-pie-graph-glasscard">
          <h5 class="title-graph">Total attendance rate</h5>
          <!-- Optional: Add chart or visual here -->
          <PieChart />
        </div>

        <div class="suggestion-glasscard-whole">
          <h5 class="title-graph">Ideas & Suggestions</h5>
          <div class="suggestions-container">
            <div class="suggestions-separations">
              <div class="suggestions-glasscard" v-for="i in 8" :key="i">
                <div class="left-side">
                  <div class="picture"></div>
                </div>
                <div class="right-side">
                  <div class="suggestions-titles">
                    <h4 class="name">Bogart</h4>
                    <h6 class="date">Feb 21, 2025</h6>
                  </div>
                  <p class="content">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text since the 1500s.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="total-pie-graph-glasscard">
          <h5 class="title-graph">Total no. of tools carried</h5>
          <!-- Optional: Add chart here -->
          <PieChart />
        </div>
      </div>
    </div>
  </div>
  <div class="overlay" v-if="!isMobile && isSidebarOpen"></div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import BarChart from "@/components/Barchart.vue";
import PieChart from "@/components/PieChart.vue";

export default {
  components: {
    BarChart,
    PieChart,
  },
  setup() {
    const isSidebarOpen = ref(true);
    const isOpen = ref(false); // for sidebar icon animation toggle
    const showNotifications = ref(false);
    const showLogoutModal = ref(false);
    const searchQuery = ref("");
    const isMobile = ref(false);
    const router = useRouter();

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
        location: "Barangay East Bajac-Bajac",
        time: "10:00am - 12:00pm",
        date: "08/04/2025",
      },
      {
        title: "Tree Planting",
        location: "Barangay West Tapinac",
        time: "8:00am - 10:00am",
        date: "09/10/2025",
      },
      {
        title: "Feeding Program",
        location: "Barangay Sta. Rita",
        time: "2:00pm - 4:00pm",
        date: "12/15/2025",
      },
    ]);

    const filteredEvents = computed(() =>
      events.value.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
      isOpen.value = !isOpen.value;
    };

    const handleResize = () => {
      /* ADDED */
      this.isMobile = window.innerWidth <= 928;
      if (this.isMobile) {
        this.isSidebarOpen = false;
      }
    };

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };

    const confirmLogout = () => {
      router.push("/LoginVolunteers");
    };

    return {
      isSidebarOpen,
      isOpen,
      toggleSidebar,
      showNotifications,
      showLogoutModal,
      searchQuery,
      notifications,
      events,
      isMobile,
      filteredEvents,
      toggleNotifications,
      confirmLogout,
    };
  },
};
</script>

<style scoped src="/src/assets/CSS Organizers/analytics.css"></style>
