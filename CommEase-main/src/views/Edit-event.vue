<template>
  <div>
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
      <router-link to="/ActivityLogOrganizers">
        <i class="bx bx-history"></i>
        <span class="nav-item" v-show="isSidebarOpen">Event History</span>
      </router-link>
    </li>
    <li>
      <router-link to="SafetyProtocolsOrganizers">
        <i class="bx bxs-shield-plus"></i>
        <span class="nav-item" v-show="isSidebarOpen">Safety & Protocols</span>
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
          <button @click="showLogoutModal = false" class="cancel-btn">Cancel</button>
          <button @click="confirmLogout" class="logout-btn">Logout</button>
        </div>
      </div>
    </div>

    <!-- NOTIFICATION PANEL -->
    <div class="notification-panel" :class="{ open: showNotifications }">
      <div class="notification-header">
        <h2>Notifications</h2>
        <i class="bx bx-x close-btn" @click="toggleNotifications"></i>
      </div>
      <div class="notification-list">
        <div class="notification-item" v-for="(notif, index) in notifications" :key="index">
          <h4>Task Completed</h4>
          <p>{{ notif.message }}</p>
          <span class="time">{{ notif.time }}</span>
        </div>
      </div>
    </div>

    <!-- OVERLAY -->
    <div class="overlay" v-if="showNotifications" @click="toggleNotifications"></div>
  </div>

  <!-- CREATE EVENT SECTION -->
  <h1 class="title-safety">Edit Event</h1>
  <hr class="safety-hr">

  <div class="event-container">
    <div class="create-event-separation">
      <h2 class="create-event-headers">Event Title</h2>
      <input class="create-event-input" v-model="eventTitle" type="text">

      <h2 class="create-event-headers">Barangay</h2>
      <input class="create-event-input" v-model="barangay" type="text">

      <h2 class="create-event-headers">Date</h2>
      <input class="create-event-input" v-model="date" type="date">

      <h2 class="create-event-headers">Time</h2>
      <input class="create-event-input" v-model="time" type="time">

      <h2 class="create-event-title">Objective of the event</h2>
      <textarea class="modal-textarea" v-model="objective"></textarea>

      <h2 class="create-event-title">Description of the event</h2>
      <textarea class="modal-textarea" v-model="description"></textarea>

      <h2 class="create-event-headers">Things needed:</h2>

      <div class="things-needed-container">
        <div class="things-separation">
          <button 
            v-for="(item, index) in thingsNeeded" 
            :key="index"
            class="things-button"
            @click="removeThing(index)"
          >
            <span>{{ item }}</span>
            <span class="thing-x">✖</span>
          </button>
        </div>

        <div class="input-and-buttons">
          <div class="input-container">
            <input 
              v-model="newThing" 
              class="things-input" 
              type="text" 
              placeholder="Things needed"
            >
            <button @click="addThing" class="add-inside-button">Add</button>
          </div>

          <div class="button-container">
            <button @click="cancelEvent" class="create-cancel">Cancel</button>
            <button @click="saveEvent" class="create-submit">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  data() {
    return {
      showNotifications: false,
      showLogoutModal: false,
      searchQuery: "",
      eventTitle: "",
      barangay: "",
      date: "",
      time: "",
      objective: "",
      description: "",
      newThing: "",
      thingsNeeded: [],
      notifications: [
        { message: "You completed the 'Update website content' task.", time: "2 hours ago" },
        { message: "You completed the 'Clean up drive' task.", time: "3 hours ago" },
        { message: "You completed the 'Meeting with organizers' task.", time: "5 hours ago" }
      ],
      events: [
        { title: "Clean Up Drive", barangay: "East Bajac - Bajac", date: "08/06/2025", time: "10:00 - 12:00", organizer: "ELITES", status: "Completed" },
        { title: "Tree Planting", barangay: "West Bajac - Bajac", date: "09/10/2025", time: "8:00 - 10:00", organizer: "GREEN INITIATIVE", status: "Pending" },
        { title: "Feeding Program", barangay: "North Bajac - Bajac", date: "10/12/2025", time: "2:00 - 4:00", organizer: "HELPING HANDS", status: "Cancelled" },
        { title: "Blood Donation", barangay: "South Bajac - Bajac", date: "12/15/2025", time: "9:00 - 1:00", organizer: "HEALTH TEAM", status: "Ongoing" }
      ],
      isSidebarOpen: ref(true) // Sidebar toggle state
    };
  },

  computed: {
    filteredEvents() {
      return this.events.filter(event => {
        const query = this.searchQuery.toLowerCase();
        return event.title.toLowerCase().includes(query) ||
               event.barangay.toLowerCase().includes(query) ||
               event.date.toLowerCase().includes(query) ||
               event.time.toLowerCase().includes(query) ||
               event.organizer.toLowerCase().includes(query) ||
               event.status.toLowerCase().includes(query);
      });
    }
  },

  methods: {
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },

    confirmLogout() {
      this.$router.push("/login");
    },

    addThing() {
      if (this.newThing.trim() !== "") {
        this.thingsNeeded.push(this.newThing.trim());
        this.newThing = "";
      }
    },

    removeThing(index) {
      this.thingsNeeded.splice(index, 1);
    },

    cancelEvent() {
      this.eventTitle = "";
      this.barangay = "";
      this.date = "";
      this.time = "";
      this.objective = "";
      this.description = "";
      this.newThing = "";
      this.thingsNeeded = [];
    },

    saveEvent() {
      // Validation
      if (!this.eventTitle || !this.barangay || !this.date || !this.time || !this.objective || !this.description || this.thingsNeeded.length === 0) {
        alert("You need to fill all the required input");
        return;
      }

      // Success
      alert("Event Edited");

      // Optional: Reset form
      this.cancelEvent();
    },

    // === Sidebar Toggle ===
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen; // Toggle sidebar state
    }
  }
};
</script>


<style scoped src="/src/assets/CSS Organizers/create-event.css"></style>
