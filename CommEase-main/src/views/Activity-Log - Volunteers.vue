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
      :notifications="notifications"
      :loading="notificationLoading"
      :unreadCount="unreadCount"
      @close="toggleNotifications"
      @mark-as-read="handleMarkAsRead"
      @mark-all-as-read="handleMarkAllAsRead"
      @delete-notification="handleDeleteNotification"
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
                v-if="['pending', 'upcoming'].includes(event.status)"
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
                  <p v-if="selectedEvent" class="event-title">
                    {{ selectedEvent.event_title }}
                  </p>

                  <!-- Error Message -->
                  <div v-if="evaluationError" class="error-message">
                    {{ evaluationError }}
                  </div>

                  <form @submit.prevent="submitEvaluation">
                    <!-- Scrollable Questions + File Upload -->
                    <div class="questions-container">
                      <!-- Questions with Star Ratings -->
                      <div
                        v-for="(question, index) in questions"
                        :key="index"
                        class="form-group"
                      >
                        <label class="question"
                          >{{ index + 1 }}. {{ question }}</label
                        >
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

                      <!-- Reflection Text Area -->
                      <div class="form-group">
                        <label class="question"
                          >Write your reflection about this event:</label
                        >
                        <textarea
                          v-model="reflectionText"
                          @input="updateWordCount"
                          class="reflection-textarea"
                          placeholder="Share your thoughts, experiences, and learnings from this community service event. What did you enjoy? What challenges did you face? How did this experience impact you? (Minimum 50 words)"
                          rows="6"
                          required
                        ></textarea>
                        <div
                          class="word-count"
                          :class="{ insufficient: reflectionWordCount < 50 }"
                        >
                          {{ reflectionWordCount }} words (minimum 50 required)
                        </div>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="form-actions">
                      <button
                        type="button"
                        @click="showModal = false"
                        class="cancel-btn"
                        :disabled="submittingEvaluation"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        class="submit-btn"
                        :disabled="submittingEvaluation"
                      >
                        <span v-if="submittingEvaluation">Submitting...</span>
                        <span v-else class="submit-eval">Submit</span>
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
import { useNotifications } from "@/composables/useNotifications";
import axios from "axios";
import NotificationPanel from "@/components/NotificationPanel.vue"; // Import the notification component
import { QrcodeStream } from "vue-qrcode-reader";
import VueCal from "vue-cal";
import VueQrcode from "@chenfengyuan/vue-qrcode";

axios.defaults.baseURL = "http://localhost:8000";

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

const showLogoutModal = ref(false);
const isOpen = ref(false);
const isSidebarOpen = ref(false);
const isMobile = ref(false);
const searchQuery = ref("");
const events = ref([]);

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
const selectedEvent = ref(null);
const submittingEvaluation = ref(false);
const evaluationError = ref(null);

// Dynamic questions from backend
const questions = ref([]);
const ratings = ref([]);

// Changed from file to text area
const reflectionText = ref("");
const reflectionWordCount = ref(0);

// Fetch evaluation questions from backend
const fetchEvaluationQuestions = async () => {
  try {
    const response = await eventService.getEvaluationQuestions();
    const questionsData = response.data.questions;

    // Convert questions object to array format
    questions.value = Object.values(questionsData);
    ratings.value = Array(questions.value.length).fill(0);

    console.log("📝 Evaluation questions loaded:", questions.value);
  } catch (error) {
    console.error("❌ Failed to fetch evaluation questions:", error);
    // Fallback to hardcoded questions if API fails
    questions.value = [
      "How would you rate the overall quality of the community service provided?",
      "How satisfied are you with the responsiveness and helpfulness of the service providers?",
      "How effective was the community service in addressing the needs of the community?",
      "How would you rate the organization and coordination of the community service activities?",
      "How likely are you to recommend this community service to others?",
    ];
    ratings.value = Array(questions.value.length).fill(0);
  }
};

// Count words in reflection text
function updateWordCount() {
  const text = reflectionText.value.trim();
  if (text === "") {
    reflectionWordCount.value = 0;
  } else {
    reflectionWordCount.value = text.split(/\s+/).length;
  }
}

// Open modal
function openEvaluationModal(event) {
  selectedEvent.value = event;
  showModal.value = true;
  ratings.value = Array(questions.value.length).fill(0);
  reflectionText.value = "";
  reflectionWordCount.value = 0;
  evaluationError.value = null;

  console.log("🔍 Opening evaluation modal for event:", event.event_title);
}

// Submit evaluation to backend
const submitEvaluation = async () => {
  try {
    submittingEvaluation.value = true;
    evaluationError.value = null;

    // Validation
    const incompleteRatings = ratings.value.some((rating) => rating === 0);
    if (incompleteRatings) {
      evaluationError.value = "Please rate all questions (1-5 stars each).";
      return;
    }

    // Validate reflection text (minimum 50 words)
    const wordCount = reflectionText.value.trim().split(/\s+/).length;
    if (reflectionText.value.trim() === "") {
      evaluationError.value =
        "Please write a reflection about your experience.";
      return;
    }

    if (wordCount < 50) {
      evaluationError.value = `Reflection must be at least 50 words. Current: ${wordCount} words.`;
      return;
    }

    if (!selectedEvent.value) {
      evaluationError.value = "No event selected.";
      return;
    }

    console.log(
      "📤 Submitting evaluation for event:",
      selectedEvent.value.event_title
    );
    console.log("📊 Ratings:", ratings.value);
    console.log(
      "📝 Reflection text:",
      reflectionText.value.substring(0, 100) + "..."
    );
    console.log("📊 Word count:", wordCount);

    // Prepare evaluation data
    const evaluationData = {
      quality_rating: ratings.value[0],
      responsiveness_rating: ratings.value[1],
      effectiveness_rating: ratings.value[2],
      organization_rating: ratings.value[3],
      recommendation_rating: ratings.value[4],
      reflection_text: reflectionText.value.trim(),
    };

    // Submit to backend
    const response = await eventService.submitPostEvaluation(
      selectedEvent.value.id,
      evaluationData
    );

    console.log("✅ Evaluation submitted successfully:", response.data);

    // Add notification for immediate feedback
    addLocalNotification(
      `Post-evaluation submitted for ${selectedEvent.value.event_title}`,
      "new_post_evaluation"
    );

    alert("Evaluation submitted successfully! Thank you for your feedback.");

    // Reset and close modal
    showModal.value = false;
    ratings.value = Array(questions.value.length).fill(0);
    reflectionText.value = "";
    reflectionWordCount.value = 0;
    selectedEvent.value = null;

    // Refresh event history to update UI
    await fetchEventHistory();
  } catch (error) {
    console.error("❌ Failed to submit evaluation:", error);

    if (error.response?.status === 422) {
      evaluationError.value =
        error.response.data.message ||
        "You have already submitted an evaluation for this event.";
    } else if (error.response?.status === 403) {
      evaluationError.value =
        "You don't have permission to evaluate this event.";
    } else {
      evaluationError.value =
        error.response?.data?.message ||
        "Failed to submit evaluation. Please try again.";
    }
  } finally {
    submittingEvaluation.value = false;
  }
};

onMounted(async () => {
  await fetchEventHistory();
  await fetchEvaluationQuestions();
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

<style scoped>
/* Error message styling */
.error-message {
  background-color: #fee;
  color: #c33;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  border: 1px solid #fcc;
}

/* Event title in modal */
.event-title {
  color: #666;
  font-style: italic;
  margin-bottom: 20px;
  text-align: center;
}

/* Loading state for buttons */
.submit-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn:disabled:hover {
  background-color: #81a263;
}

/* Reflection text area styling */
.reflection-textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.reflection-textarea:focus {
  outline: none;
  border-color: #81a263;
  box-shadow: 0 0 0 3px rgba(129, 162, 99, 0.1);
}

.reflection-textarea::placeholder {
  color: #999;
  font-style: italic;
}

/* Word count styling */
.word-count {
  text-align: right;
  font-size: 12px;
  margin-top: 5px;
  color: #666;
  font-weight: 500;
}

.word-count.insufficient {
  color: #e74c3c;
  font-weight: 600;
}
</style>
