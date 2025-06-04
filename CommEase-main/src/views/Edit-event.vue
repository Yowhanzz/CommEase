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
  <div class="test" :class="{ 'sidebar-collapsed': !isOpen }">
    <h1 class="title-safety">Edit Event</h1>
    <hr
      class="safety-hr"
      :class="{ 'sidebar-collapsed-for-divider': isOpen }"
    />
  </div>

  <div class="event-container" :class="{ 'sidebar-collapsed': !isOpen }">
    <div
      class="create-event-separation"
      :class="{ 'sidebar-collapsed': !isOpen }"
    >
      <h2 class="create-event-headers">Event Title</h2>
      <input
        class="create-event-input"
        v-model="title"
        type="text"
        placeholder="Title"
      />

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

      <h2 class="create-event-headers">Participants Needed:</h2>
      <input class="create-event-input" type="number" />
      <!-- v-model="participant limitation" -->

      <h2 class="create-event-headers">Target Participants:</h2>
      <input class="create-event-input" type="number" />
      <!-- v-model="participant limitation" -->

      <h2 class="create-event-headers">Date</h2>
      <input class="create-event-input" v-model="date" type="date" />

      <h2 class="create-event-headers">Start Time</h2>
      <input class="create-event-input" v-model="startTime" type="time" />

      <h2 class="create-event-headers">End Time</h2>
      <input class="create-event-input" v-model="endTime" type="time" />

      <h2 class="create-event-title">Objective of the event</h2>
      <textarea
        class="modal-textarea"
        v-model="objective"
        placeholder="Objective"
      ></textarea>

      <h2 class="create-event-title">Description of the event</h2>
      <textarea
        class="modal-textarea"
        v-model="description"
        placeholder="Description"
      ></textarea>

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
            />
            <button @click="addThing" class="add-inside-button">Add</button>
          </div>

          <div class="button-container">
            <button @click="cancelEdit" class="create-cancel">Cancel</button>
            <button @click="saveChanges" class="create-submit">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="overlay" v-if="!isMobile && isSidebarOpen"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  authService,
  eventService,
  formatTime,
  formatDate,
} from "@/api/services";

const route = useRoute();
const router = useRouter();

const isSidebarOpen = ref(true);
const showNotifications = ref(false);
const showLogoutModal = ref(false);
const searchQuery = ref("");
const isOpen = ref(false); // sidebar animation or icon toggle
const isMobile = ref(false);

// Event form fields
const event_id = ref(null);
const title = ref("");
const barangay = ref("");
const date = ref("");
const startTime = ref("");
const endTime = ref("");
const programs = ref([]);
const organizer = ref("");
const status = ref("");
const objective = ref("");
const description = ref("");
const thingsNeeded = ref([]);
const newThing = ref("");
const loading = ref(false);
const error = ref(null);

// Notifications
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

// Load event info on mount
onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;

    const eventId = route.params.id;
    if (!eventId) {
      throw new Error("Event ID is required");
    }

    const event = await eventService.getEvent(eventId);

    // Format date and times
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toISOString().split("T")[0]; // YYYY-MM-DD format

    // Format start and end times
    const formatTime = (timeStr) => {
      if (!timeStr) return "";
      const time = new Date(timeStr);
      return time.toTimeString().slice(0, 5); // HH:mm format
    };

    // Populate form with event data
    event_id.value = event.id;
    title.value = event.event_title;
    barangay.value = event.barangay;
    date.value = formattedDate;
    startTime.value = formatTime(event.start_time);
    endTime.value = formatTime(event.end_time);
    organizer.value = "Elites"; // Set organizer to 'Elites'
    status.value = event.status;
    objective.value = event.objective;
    description.value = event.description;
    thingsNeeded.value = event.things_needed || [];
    programs.value = event.programs || [];
  } catch (err) {
    error.value =
      err.response?.data?.message || err.message || "Failed to load event";
    // router.push("/ManageEventsOrganizers"); // Commented out for debugging
  } finally {
    loading.value = false;
  }
});

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

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const addThing = () => {
  if (newThing.value.trim()) {
    thingsNeeded.value.push(newThing.value.trim());
    newThing.value = "";
  }
};

const removeThing = (index) => {
  thingsNeeded.value.splice(index, 1);
};

const cancelEdit = () => {
  router.push("/ManageEventsOrganizers");
};

const saveChanges = async () => {
  console.log("saveChanges function called");
  try {
    loading.value = true;
    error.value = null;

    // Validate required fields
    console.log("Validating required fields...");
    if (
      !title.value ||
      !barangay.value ||
      !date.value ||
      !startTime.value ||
      !endTime.value ||
      !objective.value ||
      !description.value
    ) {
      throw new Error("Please fill in all required fields");
    }
    console.log("Required fields valid.");

    console.log("Checking programs...");
    if (programs.value.length === 0) {
      throw new Error("Please select at least one program");
    }
    console.log("Programs selected.");

    // Validate date is after today
    console.log("Validating date...");
    const selectedDate = new Date(date.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      throw new Error("Event date must be after today");
    }
    console.log("Date valid.");

    // Validate end time is after start time
    console.log("Validating time...");
    if (startTime.value >= endTime.value) {
      throw new Error("End time must be after start time");
    }
    console.log("Time valid.");

    // Validate programs
    console.log("Validating program values...");
    const validPrograms = ["BSIT", "BSCS", "BSEMC"];
    const invalidPrograms = programs.value.filter(
      (program) => !validPrograms.includes(program)
    );
    if (invalidPrograms.length > 0) {
      throw new Error(
        `Invalid programs: ${invalidPrograms.join(
          ", "
        )}. Valid programs are: ${validPrograms.join(", ")}`
      );
    }
    console.log("Program values valid.");

    // Format the date and times
    console.log("Formatting date and time...");
    const formattedDate = new Date(date.value).toISOString().split("T")[0];
    const formatTimeForAPI = (time) => {
      const [hours, minutes] = time.split(":");
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    };

    const eventData = {
      event_title: title.value,
      barangay: barangay.value,
      date: formattedDate,
      start_time: formatTimeForAPI(startTime.value),
      end_time: formatTimeForAPI(endTime.value),
      objective: objective.value,
      description: description.value,
      programs: programs.value,
      things_needed: thingsNeeded.value,
      status: status.value,
    };

    console.log("Sending update API request...", eventData);
    await eventService.updateEvent(event_id.value, eventData);
    console.log("API request successful.");
    router.push("/ManageEventsOrganizers");
  } catch (err) {
    console.error("Error during saveChanges:", err);
    error.value =
      err.response?.data?.message || err.message || "Failed to update event";
    // router.push("/ManageEventsOrganizers"); // Commented out for debugging
  } finally {
    loading.value = false;
    console.log("saveChanges function finished.");
  }
};

const confirmLogout = async () => {
  try {
    await authService.logout();
    // Clear any local storage or state
    localStorage.clear();
    // Redirect to login page
    router.push("/LoginOrganizers");
  } catch (error) {
    console.error("Logout failed:", error);
    // Even if the API call fails, we should still redirect to login
    router.push("/LoginOrganizers");
  }
};
</script>

<style scoped src="/src/assets/CSS Organizers/edit-event.css"></style>
