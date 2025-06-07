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
    :notifications="notifications"
    :loading="notificationLoading"
    :unreadCount="unreadCount"
    @close="toggleNotifications"
    @mark-as-read="handleMarkAsRead"
    @mark-all-as-read="handleMarkAllAsRead"
    @delete-notification="handleDeleteNotification"
  />

  <!-- OVERLAY (Para i-disable background) -->
  <div
    class="overlay"
    v-if="showNotifications"
    @click="toggleNotifications"
  ></div>

  <!-- SAFETY PROTOCOLS SECTIONS -->

  <div class="safety-prot-upper" :class="{ 'title-closed': !isOpen }">
    <h1 class="title-safety">SAFETY PROTOCOLS & GUIDES</h1>
    <hr
      class="safety-hr"
      :class="{ 'sidebar-collapsed-for-divider': isOpen }"
    />
  </div>

  <div
    class="container-overall"
    :class="{ 'sidebar-container-collapsed': !isOpen }"
  >
    <div class="container-1">
      <h3 class="title-1">General Safety & Guidelines</h3>
      <hr class="hr-title" />

      <p class="p-text">
        • Always follow barangay and community rules during events.
      </p>
      <p class="p-text">
        • Wear appropriate clothing and safety gear, such as gloves, masks, and
        reflective vests.
      </p>
      <p class="p-text">• Be aware of emergency exits and assembly points.</p>
      <p class="p-text">• Stay hydrated and take breaks when needed.</p>
      <p class="p-text">
        • Report any suspicious activity or hazards to event organizers.
      </p>
      <p class="p-text">
        • Follow proper hygiene and sanitation practices, especially in
        food-related or medical events.
      </p>
      <p class="p-text">
        • Be aware of your surroundings and avoid restricted areas.
      </p>
      <p class="p-text">
        • Report hazards, accidents, or suspicious activities immediately.
      </p>
    </div>

    <div class="container-12">
      <h3 class="title-1">Event Specific Safety Rules</h3>
      <hr class="hr-title" />

      <div class="container-separation">
        <div
          class="container-sentences-wrapper"
          :class="{ '.sidebar-sentences-collapsed': isOpen }"
        >
          <div class="container-sentences safety-column">
            <h3 class="title-safety-specific">For Clean-up Drives</h3>
            <p class="safety-p1">• Use proper waste segregation.</p>
            <p class="safety-p1">
              • Wear protective gloves when handling trash.
            </p>
            <p class="safety-p1">
              • Avoid sharp or hazardous materials without proper equipment.
            </p>
          </div>

          <div class="container-sentences safety-column">
            <h3 class="title-safety-specific">For Disaster Response</h3>
            <p class="safety-p">
              • Follow evacuation plans and designated safety zones.
            </p>
            <p class="safety-p">
              • Assist children, elderly individuals, and persons with
              disabilities.
            </p>
            <p class="safety-p">
              • Carry emergency kits with first-aid supplies, flashlights, and
              bottled water.
            </p>
          </div>

          <div class="container-sentences">
            <h3 class="title-safety-specific">For Medical Missions</h3>
            <p class="safety-p">
              • Sanitize hands before and after patient interactions.
            </p>
            <p class="safety-p">
              • Handle medical supplies with care and follow proper disposal
              procedures.
            </p>
            <p class="safety-p">
              • Ensure that all volunteers are briefed on hygiene protocols.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="container-1">
      <h3 class="title-1">Volunteer Responsibilities</h3>
      <hr class="hr-title" />

      <p class="p-text-1">
        <span>• Be Puncual & Reliable - </span>Arrive on time and commit to
        assigned tasks.
      </p>
      <p class="p-text-1">
        <span>• Respect & Professionalism - </span>Treat everyone with courtesy,
        regardless of background.
      </p>
      <p class="p-text-1">
        <span>• Follow Instructions - </span>Listen to organizers and comply
        with safety protocols.
      </p>
      <p class="p-text-1">
        <span>• Work as a Team - </span>Support fellow volunteers and
        communicate effectively.
      </p>
      <p class="p-text-1">
        <span>• No Disruptive Behavior - </span>Avoid unnecessary conflicts,
        inappropriate language, or distractions.
      </p>
      <p class="p-text-1">
        <span>• Protect Confidentiality - </span>Respect sensitive information
        shared during the event.
      </p>
      <p class="p-text-1">
        <span>• Take Initiative- </span>Offer help when needed and be proactive
        in problem-solving.
      </p>
      <p class="p-text-1">
        <span>• Stay Alert & Report Issues - </span>Notify leaders of safety
        concerns or emergencies.
      </p>
    </div>

    <div class="container-1">
      <h3 class="title-1">Barangay Hotline Numbers</h3>
      <hr class="hr-title" />

      <div class="container-hotline-separation">
        <div class="container-4">
          <h3 class="title-hotline">New Banicain</h3>
          <p class="p-landline-number">611 - 0382</p>
          <p class="p-phone-number">09214037292</p>
        </div>

        <div class="container-4">
          <h3 class="title-hotline">Baretto</h3>
          <p class="p-landline-number">222 - 4295</p>
          <p class="p-phone-number">09399236160</p>
        </div>

        <div class="container-4">
          <h3 class="title-hotline">Mabayuan</h3>
          <p class="p-landline-number">602 - 3900</p>
          <p class="p-phone-number">09493703473</p>
        </div>

        <div class="container-4">
          <h3 class="title-hotline">Kalalake</h3>
          <p class="p-landline-number">222 - 8264</p>
          <p class="p-phone-number">09082448894</p>
        </div>

        <div class="container-4">
          <h3 class="title-hotline">New Ilalim</h3>
          <p class="p-landline-number">222 - 5035</p>
          <p class="p-phone-number">09084932196</p>
        </div>

        <div class="container-4">
          <h3 class="title-hotline">New Kababae</h3>
          <p class="p-landline-number">222 - 8326</p>
          <p class="p-phone-number">09093385649</p>
        </div>

        <div class="container-4">
          <h3 class="title-hotline">New Asinan</h3>
          <p class="p-landline-number">223 - 5708</p>
          <p class="p-phone-number">09196480319</p>
        </div>

        <div class="container-4">
          <h3 class="title-hotline">New Cabalan</h3>
          <p class="p-landline-number">224 - 5414</p>
          <p class="p-phone-number">09392684617</p>
        </div>

        <div class="container-4">
          <h3 class="title-hotline">Kalaklan</h3>
          <p class="p-landline-number">224 - 6983</p>
          <p class="p-phone-number">09498953393</p>
        </div>

        <div class="container-4">
          <h3 class="title-hotline">Pag Asa</h3>
          <p class="p-landline-number">222 - 8037</p>
          <p class="p-phone-number">09463280033</p>
        </div>

        <div class="container-4">
          <h3 class="title-hotline">Gordon Heights</h3>
          <p class="p-landline-number">223 - 5497</p>
          <p class="p-phone-number">09178422297</p>
        </div>

        <div class="container-4">
          <h3 class="title-hotline">East Tapinac</h3>
          <p class="p-landline-number">223 - 3444</p>
          <p class="p-phone-number">09082429383</p>
        </div>

        <div class="container-4">
          <h3 class="title-hotline">West Tapinac</h3>
          <p class="p-landline-number">223 - 3434</p>
          <p class="p-phone-number">09497622222</p>
        </div>

        <div class="container-4">
          <h3 class="title-hotline">Old Cabalan</h3>
          <p class="p-landline-number">223 - 1629</p>
          <p class="p-phone-number">09084932196</p>
        </div>

        <div class="container-4">
          <h3 class="title-hotline">Sta. Rita</h3>
          <p class="p-landline-number">222 - 9225</p>
          <p class="p-phone-number">09499006254</p>
        </div>

        <div class="container-4">
          <h3 class="title-hotline">East Bajac-Bajac</h3>
          <p class="p-landline-number">222 - 5035</p>
          <p class="p-phone-number">09297690222</p>
        </div>

        <div class="container-4">
          <h3 class="title-hotline">West Bajac-Bajac</h3>
          <p class="p-landline-number">222 - 5173</p>
          <p class="p-phone-number">09499006254</p>
        </div>
      </div>
    </div>
  </div>
  <div class="overlay" v-if="!isMobile && isSidebarOpen"></div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authService } from "../api/services";
import { useNotifications } from "@/composables/useNotifications";
import NotificationPanel from "@/components/NotificationPanel.vue"; // Import the notification component

export default {
  name: "safety",

  components: {
    NotificationPanel, // Register the component
  },
  data() {
    return {
      isOpen: false, // you requested this
      isSidebarOpen: false, // toggle sidebar
      //
      isMobile: false,

      showLogoutModal: false,
    };
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

    return {
      router,
      // Notification functionality
      notifications,
      notificationLoading,
      unreadCount,
      showNotifications,
      toggleNotifications,
      handleMarkAsRead,
      handleMarkAllAsRead,
      handleDeleteNotification,
    };
  },

  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
      this.isOpen = !this.isOpen; // toggle the titles
    },

    handleResize() {
      /* ADDED */
      this.isMobile = window.innerWidth <= 928;
      if (this.isMobile) {
        this.isSidebarOpen = false;
      }
    },



    async confirmLogout() {
      try {
        await authService.logout();
        this.showLogoutModal = false;
        // Clear any local storage or state
        localStorage.clear();
        // Redirect to login page
        this.$router.push("/LoginVolunteers");
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Failed to logout. Please try again.");
      }
    },
  },
};
</script>

<style scoped src="/src/assets/CSS Organizers/Safety Protocols.css"></style>
