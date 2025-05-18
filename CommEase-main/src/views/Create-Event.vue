<template>
  <div>
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
  <h1 class="title-safety">Create Event</h1>
  <hr class="safety-hr">

  <div class="event-container">
    <div class="create-event-separation">
      <h2 class="create-event-headers">Event Title</h2>
      <input class="create-event-input" v-model="eventTitle" type="text">

      <h2 class="create-event-headers">Barangay</h2>
      <select class="create-event-input" v-model="barangay">
  <option disabled value="">Select Barangay</option>
  <option>New Banicain</option>
  <option>Baretto</option>
  <option>Mabayuan</option>
  <option>Kalalake</option>
  <option>New Ilalim</option>
  <option>New Kababae</option>
  <option>New Asinan</option>
  <option>New Cabalan</option>
  <option>Kalaklan</option>
  <option>Pag Asa</option>
  <option>Gordon Heights</option>
  <option>East Tapinac</option>
  <option>West Tapinac</option>
  <option>Old Cabalan</option>
  <option>Sta. Rita</option>
  <option>East Bajac-Bajac</option>
  <option>West Bajac-Bajac</option>
</select>


      <h2 class="create-event-headers">Organizer</h2>
      <input class="create-event-input" v-model="organizer" type="text">

      <h2 class="create-event-headers">Date</h2>
      <input class="create-event-input" v-model="date" type="date">

      <h2 class="create-event-headers"> Start Time</h2>
      <input class="create-event-input" v-model="startTime" type="time">

      <h2 class="create-event-headers"> End Time</h2>
      <input class="create-event-input" v-model="endTime" type="time">

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

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// === Sidebar Toggle ===
const isSidebarOpen = ref(true);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// === Data for the Component ===
const showNotifications = ref(false);
const showLogoutModal = ref(false);
const searchQuery = ref("");
const eventTitle = ref("");
const barangay = ref("");
const organizer = ref("");
const date = ref("");
const startTime = ref("");
const endTime = ref("");
const objective = ref("");
const description = ref("");
const newThing = ref("");
const thingsNeeded = ref([]);
const router = useRouter();

// === Notifications Data ===
const notifications = ref([
  { message: "You completed the 'Update website content' task.", time: "2 hours ago" },
  { message: "You completed the 'Clean up drive' task.", time: "3 hours ago" },
  { message: "You completed the 'Meeting with organizers' task.", time: "5 hours ago" }
]);

// === Events Data ===
const events = ref([
  { title: "Clean Up Drive", barangay: "East Bajac - Bajac", date: "08/06/2025", time: "10:00 - 12:00", organizer: "ELITES", status: "Completed" },
  { title: "Tree Planting", barangay: "West Bajac - Bajac", date: "09/10/2025", time: "8:00 - 10:00", organizer: "GREEN INITIATIVE", status: "Pending" },
  { title: "Feeding Program", barangay: "North Bajac - Bajac", date: "10/12/2025", time: "2:00 - 4:00", organizer: "HELPING HANDS", status: "Cancelled" },
  { title: "Blood Donation", barangay: "South Bajac - Bajac", date: "12/15/2025", time: "9:00 - 1:00", organizer: "HEALTH TEAM", status: "Ongoing" }
]);

// === Computed Property for Event Filtering ===
const filteredEvents = computed(() => 
  events.value.filter(event =>
    event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    event.barangay.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    event.date.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    event.time.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    event.organizer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    event.status.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

// === Methods ===
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const confirmLogout = () => {
  const router = useRouter();
  router.push("/login"); // Redirect to login page after logout
};

const addThing = () => {
  if (newThing.value.trim() !== "") {
    thingsNeeded.value.push(newThing.value.trim());
    newThing.value = "";
  }
};

const removeThing = (index) => {
  thingsNeeded.value.splice(index, 1);
};

const cancelEvent = () => {
  eventTitle.value = "";
  barangay.value = "";
  date.value = "";
  startTime.value = "";
endTime.value = "";
  objective.value = "";
  description.value = "";
  newThing.value = "";
  thingsNeeded.value = [];
};

const saveEvent = () => {
  if (
    !eventTitle.value || !barangay.value || !date.value ||
    !startTime.value || !endTime.value || !objective.value ||
    !description.value || thingsNeeded.value.length === 0 || !organizer.value
  ) {
    alert("You need to fill all the required input");
    return;
  }

  // Check if date is in the past
  const selectedDate = new Date(date.value);
  const today = new Date();

  // Remove time part of today for comparison
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    alert("Your date is no longer available");
    return;
  }

  const storedEvents = JSON.parse(localStorage.getItem('events')) || [];

  const newEvent = {
    event_id: Date.now(),
    title: eventTitle.value,
    barangay: barangay.value,
    date: date.value,
    time: `${startTime.value} - ${endTime.value}`,
    objective: objective.value,
    description: description.value,
    thingsNeeded: [...thingsNeeded.value],
    organizer: organizer.value,
    status: "Pending"
  };

  storedEvents.push(newEvent);
  localStorage.setItem('events', JSON.stringify(storedEvents));

  alert("Event Created!");
  cancelEvent();

  // Redirect and reload after slight delay
  setTimeout(() => {
    router.push('/DashboardOrganizers');
  }, 300);
};

</script>


<style scoped src="/src/assets/CSS Organizers/create-event.css"></style>
