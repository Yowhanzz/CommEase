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
  <NotificationPanel :isOpen="showNotifications" @close="toggleNotifications" />

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

      <!-- Review Analytics -->
      <div class="review-list">
        <h3>Review Analytics</h3>
        <div v-if="reviews.length === 0" class="no-data">No reviews yet.</div>
        <div v-for="(rev, index) in reviews" :key="index" class="review-card">
          <p>
            <strong>Avg Rating:</strong>
            <span class="rating-display">
              <span
                v-for="s in 5"
                :key="s"
                :class="s <= Math.round(rev.average) ? 'filled' : 'empty'"
                >★</span
              >
              ({{ rev.average.toFixed(1) }})
            </span>
          </p>
          <p class="reflection">{{ rev.reflection }}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="overlay" v-if="!isMobile && isSidebarOpen"></div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { authService } from "@/api/services";
import BarChart from "@/components/Barchart.vue";
import PieChart from "@/components/PieChart.vue";
import NotificationPanel from "@/components/NotificationPanel.vue"; // Import the notification component

// Sidebar and UI States
const isSidebarOpen = ref(true);
const isOpen = ref(false);
const showNotifications = ref(false);
const showLogoutModal = ref(false);
const searchQuery = ref("");
const isMobile = ref(false);
const router = useRouter();

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

// Event Data
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
  isMobile.value = window.innerWidth <= 928;
  if (isMobile.value) {
    isSidebarOpen.value = false;
  }
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const confirmLogout = async () => {
  try {
    await authService.logout();
    localStorage.clear();
    router.push("/LoginOrganizers");
  } catch (error) {
    console.error("Logout failed:", error);
    router.push("/LoginOrganizers");
  }
};

// === Review & Feedback Integration ===
const questions = [
  "Was the event organized well?",
  "Were the activities engaging?",
  "Were the speakers effective?",
  "Was the event timely?",
  "Would you attend a future event?",
];

const questionRatings = ref(Array(5).fill(0));
const reflection = ref("");
const reviews = ref([]);

function setQuestionRating(index, value) {
  questionRatings.value[index] = value;
}

function submitReview() {
  const valid = questionRatings.value.every((r) => r > 0);

  if (!valid || !reflection.value.trim()) {
    alert("Please answer all questions and add a reflection.");
    return;
  }

  const total = questionRatings.value.reduce((a, b) => a + b, 0);
  const average = total / questionRatings.value.length;

  reviews.value.push({
    average,
    reflection: reflection.value.trim(),
  });

  questionRatings.value = Array(5).fill(0);
  reflection.value = "";
}
</script>
name: "safety", components: { QrcodeStream, VueCal, VueQrcode,
NotificationPanel, // Register the component },

<style scoped src="/src/assets/CSS Organizers/analytics.css"></style>

<style scoped>
.review-list {
  background: #f2f4ec;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  min-width: 320px;
}
.review-list h3 {
  margin-bottom: 16px;
  color: #435739;
}

.review-list {
  margin-top: 30px;
  /* ✅ Updated to be scrollable if too long */
  max-height: 500px;
  overflow-y: auto;
}

/* Optional scroll styling */
.review-list::-webkit-scrollbar {
  width: 6px;
}

.review-list::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 10px;
}

.review-card {
  background-color: #f2f4ec;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  border-left: 4px solid #435739;
  word-wrap: break-word;
}

.rating-display {
  font-size: 18px;
  margin: 6px 0;
}

.reflection {
  font-size: 14px;
  color: #444;
  white-space: pre-wrap;
}

.no-data {
  color: #888;
  font-style: italic;
}
</style>
