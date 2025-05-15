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
      <router-link to="/ManageEventsOrganizers">
        <i class='bx  bx-calendar-check'  ></i>  
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
      <input class="create-event-input" v-model="formattedDate" type="date">

      <h2 class="create-event-headers">Time</h2>
      <input class="create-event-input" v-model="formattedTime" type="time">

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
export default {
  data() {
    return {
      eventTitle: '',
      barangay: '',
      date: '',
      time: '',
      objective: '',
      description: '',
      organizer: '',
      status: '',

      thingsNeeded: [],
      newThing: '',

      showNotifications: false,
      showLogoutModal: false,
      searchQuery: '',

      isSidebarOpen: true, // Fix here - no ref()
    };
  },

  computed: {
    formattedDate: {
      get() {
        if (!this.date) return '';
        const [month, day, year] = this.date.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      },
      set(value) {
        if (!value) return;
        const [year, month, day] = value.split('-');
        this.date = `${month}/${day}/${year}`;
      }
    },

    formattedTime: {
      get() {
        return this.time ? this.time.split('-')[0]?.trim() : '';
      },
      set(value) {
        this.time = `${value} - ??`;
      }
    }
  },

  created() {
    const query = this.$route.query;
    this.eventTitle = query.title || '';
    this.barangay = query.barangay || '';
    this.date = query.date || '';
    this.time = query.time || '';
    this.organizer = query.organizer || '';
    this.status = query.status || '';
  },

  methods: {
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },

    confirmLogout() {
      this.$router.push("/login");
    },

    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },

    addThing() {
      if (this.newThing.trim()) {
        this.thingsNeeded.push(this.newThing.trim());
        this.newThing = "";
      }
    },

    removeThing(index) {
      this.thingsNeeded.splice(index, 1);
    },

    cancelEvent() {
      this.eventTitle = '';
      this.barangay = '';
      this.date = '';
      this.time = '';
      this.objective = '';
      this.description = '';
      this.newThing = '';
      this.thingsNeeded = [];
      this.organizer = '';
      this.status = '';
    },

    saveEvent() {
  if (!this.eventTitle || !this.barangay || !this.date || !this.time || !this.objective || !this.description || this.thingsNeeded.length === 0) {
    alert("You need to fill all the required input");
    return;
  }

  alert("Event Edited Successfully!");
  
  // Optional: Dito mo ilalagay ang logic para i-save sa backend o store
  
  this.cancelEvent();

  // Navigate to Manage Events page (palitan ang path depende sa route mo)
  this.$router.push('/ManageEventsOrganizers');
}
  }
};

</script>



<style scoped src="/src/assets/CSS Organizers/create-event.css"></style>
