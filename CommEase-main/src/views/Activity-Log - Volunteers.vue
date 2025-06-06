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
            <router-link to="/DashboardVolunteers">
              <i class="bx bxs-dashboard"></i>
              <span class="nav-item" v-show="isSidebarOpen">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/ActivityLogVolunteers">
              <i class="bx bx-history"></i>
              <span class="nav-item" v-show="isSidebarOpen">Event History</span>
            </router-link>
          </li>
          <li>
            <router-link to="safety_protocol">
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
      @close="toggleNotifications"
    />

    <!-- OVERLAY -->
    <div
      class="overlay"
      v-if="showNotifications"
      @click="toggleNotifications"
    ></div>

    <!-- ACTIVITY LOG HEADER -->
    <div class="header-container" :class="{ 'sidebar-collapsed': !isOpen }">
      <h1 class="lists-events" :class="{ 'header-closed': isOpen }">
        ACTIVITY LOG
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(event, index) in filteredEvents" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ event.event_title || event.title }}</td>
            <td>{{ event.barangay }}</td>
            <td>{{ formatDate(event.date) }}</td>
            <td>
              {{ formatTime(event.start_time) }} -
              {{ formatTime(event.end_time) }}
            </td>
            <td>{{ event.organizer }}</td>
            <td>
              <button
                v-if="event.status === 'upcoming'"
                @click="unregisterFromEvent(event.id)"
                class="unregister-btn"
              >
                Unregister
              </button>
              <button
                v-if="event.status === 'completed'"
                class="evaluation-btn"
                @click="openEvaluationModal(event)"
              >
                Evaluate
              </button>

              <!-- Modal for evaluation -->
              <!-- Modal for evaluation -->
              <div v-if="showModal" class="modal-overlay">
                <div class="modal-content">
                  <h2>Event Evaluation Form</h2>

                  <form @submit.prevent="submitEvaluation">
                    <!-- Scrollable Questions + File Upload -->
                    <div class="questions-container">
                      <!-- Questions with Star Ratings -->
                      <div
                        v-for="(question, index) in questions"
                        :key="index"
                        class="form-group"
                      >
                        <label class="question">{{ question }}</label>
                        <div class="star-rating">
                          <span
                            v-for="star in 5"
                            :key="star"
                            class="star"
                            :class="{ filled: star <= ratings[index] }"
                            @click="ratings[index] = star"
                          >
                            ★
                          </span>
                        </div>
                      </div>

                      <!-- File Upload -->
                      <div class="form-group">
                        <label class="question"
                          >Upload Your Reflection Paper Here:</label
                        >
                        <div class="file-upload-wrapper">
                          <input
                            type="file"
                            id="file-upload"
                            class="file-input"
                            @change="handleFileUpload"
                            accept=".pdf,.doc,.docx"
                            required
                          />
                          <label for="file-upload" class="upload-label">
                            <span>Choose File</span>
                          </label>
                          <p v-if="reflectionFileName" class="file-name">
                            File Name: {{ reflectionFileName }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="form-actions">
                      <button
                        type="button"
                        @click="showModal = false"
                        class="cancel-btn"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        class="submit-btn"
                        @click="submitEvaluation"
                      >
                        <!-- CLICK NITO -->
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="overlay" v-if="!isMobile && isSidebarOpen"></div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import {
  authService,
  formatTime,
  formatDate,
  eventService,
} from "../api/services";
import axios from "axios";
import NotificationPanel from "@/components/NotificationPanel.vue"; // Import the notification component
import { QrcodeStream } from "vue-qrcode-reader";
import VueCal from "vue-cal";
import VueQrcode from "@chenfengyuan/vue-qrcode";

axios.defaults.baseURL = "http://localhost:8000";

const router = useRouter();

const showNotifications = ref(false);
const showLogoutModal = ref(false);
const isOpen = ref(false);
const isSidebarOpen = ref(false);
const isMobile = ref(false);
const searchQuery = ref("");
const events = ref([]);

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

const filteredEvents = computed(() => {
  if (!Array.isArray(events.value)) {
    return [];
  }
  const query = searchQuery.value.toLowerCase();
  return events.value.filter(
    (event) =>
      event.title?.toLowerCase().includes(query) ||
      event.barangay?.toLowerCase().includes(query) ||
      event.organizer?.toLowerCase().includes(query) ||
      formatDate(event.date)?.toLowerCase().includes(query)
  );
});

async function fetchEventHistory() {
  try {
    console.log("Fetching event history...");
    const response = await eventService.getEventHistory();
    console.log("API Response for Event History:", response);
    const eventsData = response.data;
    events.value = Array.isArray(eventsData) ? eventsData : [];
    console.log("Processed event history:", events.value);
  } catch (error) {
    console.error("Failed to fetch event history:", error);
    alert("Failed to load event history. Please try again.");
    events.value = [];
  }
}

async function unregisterFromEvent(eventId) {
  if (!confirm("Are you sure you want to unregister from this event?")) {
    return;
  }

  try {
    await eventService.unregister(eventId);
    await fetchEventHistory();
    alert("Successfully unregistered from the event");
  } catch (error) {
    console.error("Failed to unregister:", error);
    alert("Failed to unregister from the event. Please try again.");
  }
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value;
}

function handleResize() {
  isMobile.value = window.innerWidth <= 928;
  if (isMobile.value) {
    isSidebarOpen.value = false;
  }
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  isOpen.value = !isOpen.value;
}

async function confirmLogout() {
  try {
    await authService.logout();
    showLogoutModal.value = false;
    router.push("/LoginVolunteers");
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Failed to logout. Please try again.");
  }
}

// --- Modal Evaluation Form state & functions ---

const showModal = ref(false);

const questions = [
  "1. How would you rate the overall quality of the community service provided?",
  "2. How satisfied are you with the responsiveness and helpfulness of the service providers?",
  "3. How effective was the community service in addressing the needs of the community?",
  "4. How would you rate the organization and coordination of the community service activities?",
  "5. How likely are you to recommend this community service to others?",
];
const ratings = ref(Array(questions.length).fill(0));

const reflectionFile = ref(null);
const reflectionFileName = ref("");

// Open modal
function openEvaluationModal(event) {
  showModal.value = true;
  ratings.value = Array(questions.length).fill(0);
  reflectionFile.value = null;
  reflectionFileName.value = "";
}

// Handle file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    reflectionFile.value = file;
    reflectionFileName.value = file.name;
  } else {
    reflectionFile.value = null;
    reflectionFileName.value = "";
  }
};

// Submit with validation
const submitEvaluation = () => {
  const incompleteRatings = ratings.value.some((rating) => rating === 0);
  const noFileUploaded = !reflectionFile.value;

  if (incompleteRatings || noFileUploaded) {
    alert("Please complete the evaluation form needed.");
    return;
  }

  // ✅ If complete, proceed
  alert("Evaluated Successfully!");
  console.log("Ratings:", ratings.value);
  console.log("Reflection File:", reflectionFile.value);

  // Reset after submission
  showModal.value = false;
  ratings.value = Array(questions.length).fill(0);
  reflectionFile.value = null;
  reflectionFileName.value = "";
};

onMounted(() => {
  fetchEventHistory();
  window.addEventListener("resize", handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

name: "safety", components: { QrcodeStream, VueCal, VueQrcode,
NotificationPanel, // Register the component },

<style scoped src="/src/assets/CSS Volunteers/Activitylog.css"></style>
