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
  </div>

  <!-- CREATE EVENT SECTION -->
  <h1 class="title-safety" :class="{ 'sidebar-collapsed': !isOpen }">
    Create Event
  </h1>
  <hr class="safety-hr" :class="{ 'sidebar-collapsed-for-divider': isOpen }" />

  <div class="event-container">
    <div class="create-event-separation">
      <h2 class="create-event-headers">Event Title</h2>
      <input class="create-event-input" v-model="eventTitle" type="text" />

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
      <input class="create-event-input" v-model="organizer" type="text" />

      <h2 class="create-event-headers">Programs</h2>
      <div class="create-event-checkbox-group">
        <label>
          <input type="checkbox" value="BSIT" v-model="programs" /> BSIT
        </label>
        <label>
          <input type="checkbox" value="BSCS" v-model="programs" /> BSCS
        </label>
        <label>
          <input type="checkbox" value="BSEMC" v-model="programs" /> BSEMC
        </label>
      </div>

      <h2 class="create-event-headers">Date</h2>
      <input class="create-event-input" v-model="date" type="date" />

      <h2 class="create-event-headers">Start Time</h2>
      <input class="create-event-input" v-model="startTime" type="time" />

      <h2 class="create-event-headers">End Time</h2>
      <input class="create-event-input" v-model="endTime" type="time" />

      <h2 class="create-event-title">Objective of the event</h2>
      <textarea class="modal-textarea" v-model="objective"></textarea>

      <h2 class="create-event-title">Description of the event</h2>
      <textarea class="modal-textarea" v-model="description"></textarea>

      <h2 class="create-event-headers">Things needed:</h2>

      <div class="things-needed-container">
        <div class="things-separation">
          <div v-for="(item, index) in thingsNeeded" :key="index" class="thing-item">
            <button class="things-button" @click="removeThing(index)">
              <span>{{ item }}</span>
              <span class="thing-x">✖</span>
            </button>
          </div>
        </div>

        <div class="input-and-buttons">
          <div class="input-container">
            <input
              v-model="newThing"
              class="things-input"
              type="text"
              placeholder="Things needed"
              @keyup.enter="addThing"
            />
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { eventService } from '../api/services';
import { authService } from '../api/services';

// === Sidebar Toggle ===
const isSidebarOpen = ref(true);
const isOpen = ref(false);
const isMobile = ref(false);

// === Data for the Component ===
const showNotifications = ref(false);
const showLogoutModal = ref(false);
const searchQuery = ref("");
const eventTitle = ref("");
const barangay = ref("");
const organizer = ref("");
const programs = ref([]);
const date = ref("");
const startTime = ref("");
const endTime = ref("");
const objective = ref("");
const description = ref("");
const newThing = ref("");
const thingsNeeded = ref([]);
const router = useRouter();
const loading = ref(false);
const error = ref(null);

// === Notifications Data ===
const notifications = ref([
  {
    message: "You completed the 'Update website content' task.",
    time: "2 hours ago",
  },
  { message: "You completed the 'Clean up drive' task.", time: "3 hours ago" },
  {
    message: "You completed the 'Meeting with organizers' task.",
    time: "5 hours ago",
  },
]);

// === Events Data ===
const events = ref([
  {
    title: "Clean Up Drive",
    barangay: "East Bajac - Bajac",
    date: "08/06/2025",
    time: "10:00 - 12:00",
    organizer: "ELITES",
    status: "Completed",
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
    status: "Cancelled",
  },
  {
    title: "Blood Donation",
    barangay: "South Bajac - Bajac",
    date: "12/15/2025",
    time: "9:00 - 1:00",
    organizer: "HEALTH TEAM",
    status: "Ongoing",
  },
]);

// === Computed Property for Event Filtering ===
const filteredEvents = computed(() => {
  const query = searchQuery.value.toLowerCase();

  return events.value.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(query) ||
      event.barangay.toLowerCase().includes(query) ||
      event.date.toLowerCase().includes(query) ||
      event.time.toLowerCase().includes(query) ||
      event.organizer.toLowerCase().includes(query) ||
      event.status.toLowerCase().includes(query);

    if (programFilters.value.length === 0) return matchesSearch;

    const eventPrograms = event.programs || [];

    const matchesProgram = eventPrograms.some((p) =>
      programFilters.value.includes(p)
    );

    return matchesSearch && matchesProgram;
  });
});

// === Methods ===
const addThing = () => {
  if (newThing.value.trim()) {
    thingsNeeded.value.push(newThing.value.trim());
    newThing.value = "";
  }
};

const removeThing = (index) => {
  thingsNeeded.value.splice(index, 1);
};

const cancelEvent = () => {
  router.push('/ManageEventsOrganizers');
};

const saveEvent = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Validate required fields
    if (!eventTitle.value || !barangay.value || !date.value || !startTime.value || !endTime.value || !objective.value || !description.value) {
      throw new Error('Please fill in all required fields');
    }

    if (programs.value.length === 0) {
      throw new Error('Please select at least one program');
    }

    const eventData = {
      eventTitle: eventTitle.value,
      barangay: barangay.value,
      date: date.value,
      startTime: startTime.value,
      endTime: endTime.value,
      objective: objective.value,
      description: description.value,
      programs: programs.value,
      thingsNeeded: thingsNeeded.value
    };

    const response = await eventService.createEvent(eventData);
    
    if (response.status === 201) {
      router.push('/ManageEventsOrganizers');
    } else {
      throw new Error('Failed to create event');
    }
  } catch (err) {
    if (err.response?.status === 401) {
      error.value = 'Please log in to create an event';
      router.push('/LoginOrganizers');
    } else if (err.response?.status === 403) {
      error.value = 'You do not have permission to create events. Please log in as an organizer.';
      router.push('/LoginOrganizers');
    } else {
      error.value = err.response?.data?.message || err.message || 'Failed to create event';
    }
    console.error('Event creation error:', err);
  } finally {
    loading.value = false;
  }
};

const confirmLogout = async () => {
  try {
    await authService.logout();
    router.push('/LoginOrganizers');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  isOpen.value = !isOpen.value;
};

const handleResize = () => {
  isMobile.value = window.innerWidth <= 928;
  if (isMobile.value) {
    isSidebarOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped src="/src/assets/CSS Organizers/create-event.css"></style>

<style scoped>
/* Add these styles */
.thing-item {
  margin: 5px;
  display: inline-block;
}

.things-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.things-button:hover {
  background: #f8f8f8;
}

.thing-x {
  color: #dc3545;
  font-size: 14px;
}

.things-separation {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}
</style>
