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
    <div v-if="loading" class="loading-state">
      <p>Loading analytics data...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchEventAnalytics" class="retry-btn">Retry</button>
    </div>

    <div v-else-if="analyticsData" class="total-analytics-container">
<<<<<<< HEAD
      <!--     <div class="event-header">
        <h2 v-if="eventData">{{ eventData.event_title }} - Analytics</h2>
        <p v-if="eventData" class="event-details">
=======
      <div class="event-header">
        <h2 v-if="eventData && eventData.event_title">{{ eventData.event_title }} - Analytics</h2>
        <h2 v-else>Event Analytics</h2>
        <p v-if="eventData && eventData.date && eventData.barangay" class="event-details">
>>>>>>> 71bff5e1b2c49db968d756e499a3a2b0d0a59554
          {{ formatDate(eventData.date) }} • {{ eventData.barangay }}
        </p>
      </div> -->

      <div class="total-analytics-separation">
        <div class="total-container">
          <h5 class="title-total">Total Volunteers</h5>
          <p class="total-no">{{ analyticsData.registered_count || 0 }}</p>
          <small class="subtitle">Registered</small>
        </div>
        <div class="total-container">
          <h5 class="title-total">Attendance Rate</h5>
          <p class="total-no">{{ analyticsData.attendance_rate || 0 }}%</p>
          <small class="subtitle"
            >{{ analyticsData.attended_count || 0 }}/{{
              analyticsData.registered_count || 0
            }}</small
          >
        </div>
        <div class="total-container">
          <h5 class="title-total">Event Duration</h5>
          <p class="total-no">{{ analyticsData.duration || "N/A" }}</p>
          <small class="subtitle">Actual time</small>
        </div>
        <div class="total-container">
          <h5 class="title-total">Volunteer Hours</h5>
          <p class="total-no">
            {{ analyticsData.time_analysis?.total_volunteer_hours || 0 }}h
          </p>
          <small class="subtitle">Total contributed</small>
        </div>
      </div>

      <!-- Participant Progress Section -->
      <div v-if="analyticsData.participant_progress" class="progress-section">
        <h5 class="title-graph">Participant Progress</h5>
        <div class="progress-cards">
          <div class="progress-card">
            <h6>Registration Progress</h6>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{
                  width:
                    analyticsData.participant_progress.progress_percentage +
                    '%',
                }"
              ></div>
            </div>
            <p>
              {{ analyticsData.participant_progress.registered }}/{{
                analyticsData.participant_progress.limit
              }}
              ({{ analyticsData.participant_progress.progress_percentage }}%)
            </p>
          </div>
          <div class="progress-card">
            <h6>Target Achievement</h6>
            <div class="progress-bar">
              <div
                class="progress-fill target"
                :style="{
                  width:
                    Math.min(
                      analyticsData.participant_progress.target_percentage,
                      100
                    ) + '%',
                }"
              ></div>
            </div>
            <p>
              {{ analyticsData.participant_progress.registered }}/{{
                analyticsData.participant_progress.target
              }}
              ({{ analyticsData.participant_progress.target_percentage }}%)
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- registrationForm -->
    <!-- :registraion="registrationForm" -->

    <!-- GRAPH SECTION -->
    <div class="total-graph-container">
      <div class="total-graph-separation">
        <div class="total-graph-glasscard volunteer-duration-container">
          <h5 class="title-graph">Volunteer Duration Analysis</h5>
          <BarChart
            v-if="volunteerDurationData.length > 0"
            :chartData="volunteerDurationData"
            title="Hours Contributed by Volunteers"
          />
          <div v-else class="no-data">No volunteer duration data available</div>
        </div>

        <div class="total-pie-graph-glasscard">
          <h5 class="title-graph">Program Distribution</h5>
          <PieChart
            v-if="programDistributionData.length > 0"
            :chartData="programDistributionData"
            title="Volunteers by Program"
          />
          <div v-else class="no-data">
            No program distribution data available
          </div>
        </div>

        <div class="total-graph-glasscard">
          <h5 class="title-graph">Time in & out of Volunteers</h5>
          <div
            v-if="analyticsData?.volunteer_time_details"
            class="modern-table-container"
          >
            <div class="table-header">
              <h6>
                {{ analyticsData.volunteer_time_details.length }} Volunteers
                Tracked
              </h6>
            </div>
            <div class="modern-table-wrapper">
              <table class="modern-users-table">
                <thead>
                  <tr>
                    <th>
                      <div class="th-content">
                        <i class="bx bx-user"></i>
                        <span>Volunteer Name</span>
                      </div>
                    </th>
                    <th>
                      <div class="th-content">
                        <i class="bx bx-time"></i>
                        <span>Time In</span>
                      </div>
                    </th>
                    <th>
                      <div class="th-content">
                        <i class="bx bx-time-five"></i>
                        <span>Time Out</span>
                      </div>
                    </th>
                    <th>
                      <div class="th-content">
                        <i class="bx bx-stopwatch"></i>
                        <span>Duration</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="volunteer in analyticsData.volunteer_time_details"
                    :key="volunteer.id"
                    :class="{
                      'incomplete-time':
                        !volunteer.time_in || !volunteer.time_out,
                    }"
                  >
                    <td class="volunteer-name-cell">
                      <div class="volunteer-info">
                        <div class="volunteer-avatar">
                          {{ volunteer.name.charAt(0).toUpperCase() }}
                        </div>
                        <div class="volunteer-details">
                          <span class="name">{{ volunteer.name }}</span>
                          <span class="program">{{ volunteer.program }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="time-cell">
                      <div class="time-badge time-in" v-if="volunteer.time_in">
                        <i class="bx bx-log-in"></i>
                        <span>{{ volunteer.time_in }}</span>
                      </div>
                      <div class="no-time-badge" v-else>
                        <i class="bx bx-x"></i>
                        <span>Not recorded</span>
                      </div>
                    </td>
                    <td class="time-cell">
                      <div
                        class="time-badge time-out"
                        v-if="volunteer.time_out"
                      >
                        <i class="bx bx-log-out"></i>
                        <span>{{ volunteer.time_out }}</span>
                      </div>
                      <div class="no-time-badge" v-else>
                        <i class="bx bx-x"></i>
                        <span>Not recorded</span>
                      </div>
                    </td>
                    <td class="duration-cell">
                      <div
                        class="duration-badge"
                        v-if="volunteer.duration_hours"
                      >
                        <i class="bx bx-timer"></i>
                        <span>{{ volunteer.duration_hours }}h</span>
                      </div>
                      <div class="no-duration-badge" v-else>
                        <i class="bx bx-minus"></i>
                        <span>-</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="no-data">No volunteer time data available</div>
        </div>

        <div class="total-pie-graph-glasscard">
          <h5 class="title-graph">Attendance Overview</h5>
          <div v-if="analyticsData" class="attendance-stats">
            <div class="stat-item">
              <span class="stat-label">Present:</span>
<<<<<<< HEAD
              <span class="stat-value present">{{
                analyticsData.attended_count || 0
              }}</span>
=======
              <span class="stat-value present">{{ analyticsData.present_count || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">No Time Out:</span>
              <span class="stat-value no-time-out">{{ analyticsData.no_time_out_count || 0 }}</span>
>>>>>>> 71bff5e1b2c49db968d756e499a3a2b0d0a59554
            </div>
            <div class="stat-item">
              <span class="stat-label">Absent:</span>
              <span class="stat-value absent">{{
                analyticsData.absent_count || 0
              }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Rate:</span>
              <span class="stat-value rate"
                >{{ analyticsData.attendance_rate || 0 }}%</span
              >
            </div>
          </div>
          <!-- Dynamic Pie Chart for Attendance -->
          <DynamicPieChart
            v-if="attendanceChartData.length > 0"
            :chartData="attendanceChartData"
            title="Attendance Distribution"
          />
        </div>

        <div class="suggestion-glasscard-whole">
          <h5 class="title-graph">Ideas & Suggestions</h5>
          <div class="suggestions-container">
            <div v-if="suggestions.length === 0" class="no-data">
              No suggestions submitted yet.
            </div>
            <div v-else class="suggestions-separations">
              <div
                class="suggestions-glasscard"
                v-for="suggestion in suggestions"
                :key="suggestion.id"
              >
                <div class="left-side">
                  <div class="picture"></div>
                </div>
                <div class="right-side">
                  <div class="suggestions-titles">
                    <h4 class="name">
                      {{ suggestion.volunteer?.full_name || "Anonymous" }}
                    </h4>
                    <h6 class="date">
                      {{ formatDate(suggestion.created_at) }}
                    </h6>
                  </div>
                  <p class="content">
                    {{ suggestion.suggestion }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="total-pie-graph-glasscard">
          <h5 class="title-graph">Things Brought Analysis</h5>
          <div
            v-if="analyticsData?.things_brought"
            class="things-brought-stats"
          >
            <div class="total-items">
              <span class="big-number">{{
                analyticsData.things_brought_total || 0
              }}</span>
              <span class="label">Total Items</span>
            </div>
            <!-- Dynamic Pie Chart for Things Brought -->
            <DynamicPieChart
              v-if="thingsBroughtChartData.length > 0"
              :chartData="thingsBroughtChartData"
              title="Items Distribution"
            />
          </div>
          <div v-else class="no-data">No items brought data available</div>
        </div>
      </div>

      <!-- Review Analytics -->
      <div class="review-list">
        <h3>Post Evaluation Analytics</h3>



        <!-- Average Ratings Summary -->
        <div v-if="averageRatings" class="ratings-summary">
          <h4>Average Ratings per Question</h4>
          <div class="rating-item">
            <span>Quality of Service:</span>
            <span class="rating-stars">
<<<<<<< HEAD
              <span
                v-for="s in 5"
                :key="s"
                :class="
                  s <= Math.round(averageRatings.quality) ? 'filled' : 'empty'
                "
                >★</span
              >
              ({{ averageRatings.quality }})
=======
              <span v-for="s in 5" :key="s" :class="s <= Number(averageRatings.quality) ? 'filled' : 'empty'">★</span>
              ({{ Number(averageRatings.quality).toFixed(1) }})
>>>>>>> 71bff5e1b2c49db968d756e499a3a2b0d0a59554
            </span>
          </div>
          <div class="rating-item">
            <span>Responsiveness:</span>
            <span class="rating-stars">
<<<<<<< HEAD
              <span
                v-for="s in 5"
                :key="s"
                :class="
                  s <= Math.round(averageRatings.responsiveness)
                    ? 'filled'
                    : 'empty'
                "
                >★</span
              >
              ({{ averageRatings.responsiveness }})
=======
              <span v-for="s in 5" :key="s" :class="s <= Number(averageRatings.responsiveness) ? 'filled' : 'empty'">★</span>
              ({{ Number(averageRatings.responsiveness).toFixed(1) }})
>>>>>>> 71bff5e1b2c49db968d756e499a3a2b0d0a59554
            </span>
          </div>
          <div class="rating-item">
            <span>Effectiveness:</span>
            <span class="rating-stars">
<<<<<<< HEAD
              <span
                v-for="s in 5"
                :key="s"
                :class="
                  s <= Math.round(averageRatings.effectiveness)
                    ? 'filled'
                    : 'empty'
                "
                >★</span
              >
              ({{ averageRatings.effectiveness }})
=======
              <span v-for="s in 5" :key="s" :class="s <= Number(averageRatings.effectiveness) ? 'filled' : 'empty'">★</span>
              ({{ Number(averageRatings.effectiveness).toFixed(1) }})
>>>>>>> 71bff5e1b2c49db968d756e499a3a2b0d0a59554
            </span>
          </div>
          <div class="rating-item">
            <span>Organization:</span>
            <span class="rating-stars">
<<<<<<< HEAD
              <span
                v-for="s in 5"
                :key="s"
                :class="
                  s <= Math.round(averageRatings.organization)
                    ? 'filled'
                    : 'empty'
                "
                >★</span
              >
              ({{ averageRatings.organization }})
=======
              <span v-for="s in 5" :key="s" :class="s <= Number(averageRatings.organization) ? 'filled' : 'empty'">★</span>
              ({{ Number(averageRatings.organization).toFixed(1) }})
>>>>>>> 71bff5e1b2c49db968d756e499a3a2b0d0a59554
            </span>
          </div>
          <div class="rating-item">
            <span>Recommendation:</span>
            <span class="rating-stars">
<<<<<<< HEAD
              <span
                v-for="s in 5"
                :key="s"
                :class="
                  s <= Math.round(averageRatings.recommendation)
                    ? 'filled'
                    : 'empty'
                "
                >★</span
              >
              ({{ averageRatings.recommendation }})
=======
              <span v-for="s in 5" :key="s" :class="s <= Number(averageRatings.recommendation) ? 'filled' : 'empty'">★</span>
              ({{ Number(averageRatings.recommendation).toFixed(1) }})
>>>>>>> 71bff5e1b2c49db968d756e499a3a2b0d0a59554
            </span>
          </div>
        </div>
      </div>

      <!-- Reflections Section -->
      <div
        v-if="postEvaluations.some((e) => e.reflection_text)"
        class="reflections-list"
      >
        <h3>Volunteer Reflections</h3>
        <div class="reflections-container">
          <div
            v-for="evaluation in postEvaluations.filter(
              (e) => e.reflection_text
            )"
            :key="evaluation.id"
            class="reflection-card"
          >
            <div class="reflection-header">
              <h4 class="volunteer-name">
                {{ evaluation.volunteer?.full_name || "Anonymous" }}
              </h4>
              <span class="reflection-date">{{
                formatDate(evaluation.created_at)
              }}</span>
            </div>
            <div class="reflection-content">
              {{ evaluation.reflection_text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="overlay" v-if="!isMobile && isSidebarOpen"></div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { authService, eventService } from "@/api/services";
import { useNotifications } from "@/composables/useNotifications";
import BarChart from "@/components/Barchart.vue";
import PieChart from "@/components/PieChart.vue";
import DynamicPieChart from "@/components/DynamicPieChart.vue";
import NotificationPanel from "@/components/NotificationPanel.vue";

// Props
const props = defineProps({
  eventId: {
    type: String,
    required: true,
  },
});

// Sidebar and UI States
const isSidebarOpen = ref(true);
const isOpen = ref(false);
const showLogoutModal = ref(false);
const searchQuery = ref("");
const isMobile = ref(false);
const router = useRouter();
const route = useRoute();

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

// Event Analytics Data
const eventData = ref(null);
const analyticsData = ref(null);
const suggestions = ref([]);
const postEvaluations = ref([]);
const loading = ref(false);
const error = ref(null);

// Fetch event analytics data
const fetchEventAnalytics = async () => {
  try {
    loading.value = true;
    error.value = null;

    console.log("📊 Fetching analytics for event ID:", props.eventId);

    // Fetch basic analytics
    const analyticsResponse = await eventService.getEventAnalytics(
      props.eventId
    );
    analyticsData.value = analyticsResponse.data;

    // Fetch suggestions
    const suggestionsResponse = await eventService.getEventSuggestions(
      props.eventId
    );
    suggestions.value = suggestionsResponse.data.suggestions || [];

    // Fetch post evaluations
    const evaluationsResponse = await eventService.getPostEvaluations(
      props.eventId
    );
    postEvaluations.value = evaluationsResponse.data.evaluations || [];

    // Fetch event details
    const eventResponse = await eventService.getEvent(props.eventId);
    eventData.value = eventResponse.data || eventResponse;

    console.log("✅ Analytics data loaded successfully");
<<<<<<< HEAD
    console.log("📈 Analytics:", analyticsData.value);
    console.log("💡 Suggestions:", suggestions.value);
    console.log("⭐ Evaluations:", postEvaluations.value);
=======

>>>>>>> 71bff5e1b2c49db968d756e499a3a2b0d0a59554
  } catch (err) {
    console.error("❌ Failed to fetch analytics:", err);
    error.value =
      err.response?.data?.message || "Failed to load analytics data";
  } finally {
    loading.value = false;
  }
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

// Computed properties for analytics display
const averageRatings = computed(() => {
  if (!postEvaluations.value || postEvaluations.value.length === 0) return null;

  const totals = {
    quality: 0,
    responsiveness: 0,
    effectiveness: 0,
    organization: 0,
    recommendation: 0,
  };

  postEvaluations.value.forEach((evaluation) => {
    totals.quality += evaluation.quality_rating;
    totals.responsiveness += evaluation.responsiveness_rating;
    totals.effectiveness += evaluation.effectiveness_rating;
    totals.organization += evaluation.organization_rating;
    totals.recommendation += evaluation.recommendation_rating;
  });

  const count = postEvaluations.value.length;
  return {
    quality: (totals.quality / count).toFixed(1),
    responsiveness: (totals.responsiveness / count).toFixed(1),
    effectiveness: (totals.effectiveness / count).toFixed(1),
    organization: (totals.organization / count).toFixed(1),
    recommendation: (totals.recommendation / count).toFixed(1),
    overall: (
      (totals.quality +
        totals.responsiveness +
        totals.effectiveness +
        totals.organization +
        totals.recommendation) /
      (count * 5)
    ).toFixed(1),
  };
});

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Helper functions for star rating display
const getStarClass = (starNumber, rating) => {
  const numericRating = parseFloat(rating) || 0;
  return starNumber <= numericRating ? 'filled' : 'empty';
};

const formatRating = (rating) => {
  return parseFloat(rating || 0).toFixed(1);
};

// Chart data computed properties
const attendanceChartData = computed(() => {
  if (!analyticsData.value) return [];

<<<<<<< HEAD
  return [
    {
      label: "Attended",
      value: analyticsData.value.attended_count || 0,
      color: "#435739",
    },
    {
      label: "Absent",
      value: analyticsData.value.absent_count || 0,
      color: "#e74c3c",
    },
  ];
=======
  const chartData = [];

  // Present (completed time in and out)
  if (analyticsData.value.present_count > 0) {
    chartData.push({
      label: 'Present',
      value: analyticsData.value.present_count,
      color: '#435739'
    });
  }

  // No time out (has time in but no time out)
  if (analyticsData.value.no_time_out_count > 0) {
    chartData.push({
      label: 'No Time Out',
      value: analyticsData.value.no_time_out_count,
      color: '#ff9800'
    });
  }

  // Absent (no time in)
  if (analyticsData.value.absent_count > 0) {
    chartData.push({
      label: 'Absent',
      value: analyticsData.value.absent_count,
      color: '#e74c3c'
    });
  }

  return chartData;
>>>>>>> 71bff5e1b2c49db968d756e499a3a2b0d0a59554
});

const thingsBroughtChartData = computed(() => {
  if (!analyticsData.value?.things_brought) return [];

  const colors = [
    "#435739",
    "#81a263",
    "#6b8a4f",
    "#9bb86f",
    "#b5c98a",
    "#c7d59f",
  ];

  return Object.entries(analyticsData.value.things_brought).map(
    ([item, count], index) => ({
      label: item,
      value: count,
      color: colors[index % colors.length],
    })
  );
});

// Volunteer duration data for bar chart
const volunteerDurationData = computed(() => {
  if (!analyticsData.value?.volunteer_time_details) return [];

  return analyticsData.value.volunteer_time_details
    .filter(
      (volunteer) => volunteer.duration_hours && volunteer.duration_hours > 0
    )
    .sort((a, b) => b.duration_hours - a.duration_hours) // Sort by duration descending
    .slice(0, 10) // Show top 10 volunteers
    .map((volunteer) => ({
      name: volunteer.name,
      duration: volunteer.duration_hours,
    }));
});

// Program distribution data for pie chart
const programDistributionData = computed(() => {
  if (!analyticsData.value?.program_distribution) return [];

  const colors = ["#435739", "#81a263", "#6b8a4f", "#9bb86f", "#b5c98a"];

  return Object.entries(analyticsData.value.program_distribution).map(
    ([program, count], index) => ({
      label: program,
      value: count,
      color: colors[index % colors.length],
    })
  );
});

// Initialize data on mount
onMounted(() => {
  fetchEventAnalytics();
  handleResize();
  window.addEventListener("resize", handleResize);
});
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

.reflection {
  font-size: 14px;
  color: #444;
  white-space: pre-wrap;
}

.no-data {
  color: #888;
  font-style: italic;
  text-align: center;
  padding: 20px;
}

/* Modern Time Tracking Table Styles */
.modern-table-container {
  background: #f2f4ec;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  margin-top: 20px;
  border: 1px solid #e8ecef;
}

.table-header {
  background-color: #435739;
  padding: 16px 24px;
  color: white;
}

.table-header h6 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-header h6::before {
  content: "📊";
  font-size: 18px;
}

.modern-table-wrapper {
  overflow-x: auto;
  max-height: 500px;
  overflow-y: auto;
}

.modern-users-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  background: white;
}

.modern-users-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

.modern-users-table th {
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.th-content i {
  font-size: 16px;
  color: #6c757d;
}

.modern-users-table tbody tr {
  transition: all 0.2s ease;
  border-bottom: 1px solid #f1f3f4;
}

.modern-users-table tbody tr:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modern-users-table tbody tr.incomplete-time {
  background: #fff8e1;
  border-left: 4px solid #ff9800;
}

.modern-users-table tbody tr.incomplete-time:hover {
  background: #fff3c4;
}

.modern-users-table td {
  padding: 16px 12px;
  vertical-align: middle;
  border-bottom: 1px solid #f1f3f4;
}

/* Volunteer Name Cell */
.volunteer-name-cell {
  min-width: 200px;
}

.volunteer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.volunteer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #435739, #81a263);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
}

.volunteer-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.volunteer-details .name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.volunteer-details .program {
  font-size: 12px;
  color: #6c757d;
  background: #e9ecef;
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
  font-weight: 500;
}

/* Time Cell Styles */
.time-cell {
  min-width: 140px;
}

.time-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 13px;
  font-family: "Segoe UI", monospace;
}

.time-badge.time-in {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.time-badge.time-out {
  background: #c74132;
  color: #f2f4ec;
  border: 1px solid #b3d7ff;
}

.no-time-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 20px;
  background: #f8d7da;
  color: #c74132;
  border: 1px solid #f5c6cb;
  font-weight: 500;
  font-size: 13px;
}

/* Duration Cell */
.duration-cell {
  min-width: 120px;
}

.duration-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 20px;
  background-color: #435739;
  color: white;
  font-weight: 600;
  font-size: 13px;
  box-shadow: 0 2px 4px rgba(67, 87, 57, 0.3);
}

.no-duration-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 20px;
  background: #e9ecef;
  color: #6c757d;
  font-weight: 500;
  font-size: 13px;
}

/* Loading and Error States */
.loading-state,
.error-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.retry-btn {
  background: #81a263;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.retry-btn:hover {
  background: #6b8a4f;
}

/* Event Header */
.event-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.event-header h2 {
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-size: 24px;
}

.event-details {
  color: #666;
  margin: 0;
  font-size: 16px;
}

/* Ratings Summary */
.ratings-summary {
  background: #f2f4ec;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

  border-left: 4px solid #435739;
}

.ratings-summary h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.rating-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 5px 0;
}

.rating-item:first-child {
  font-weight: 500;
  color: #2c3e50;
}

.rating-item span {
  font-weight: 500;
  color: #2c3e50;
}

.rating-stars {
  font-size: 16px;
}

.rating-stars .filled {
  color: #ffd700;
}

.rating-stars .empty {
  color: #ddd;
}

/* Evaluation Cards */
.evaluation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.evaluation-date {
  font-size: 12px;
  color: #666;
  font-style: italic;
}

/* Reflections Section */
.reflections-list {
  background: #f2f4ec;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  margin-top: 20px;
}

.reflections-list h3 {
  margin-bottom: 16px;
  color: #435739;
}

.reflections-container {
  max-height: 500px;
  overflow-y: auto;
}

.reflection-card {
  background: #f2f4ec;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  border-left: 4px solid #435739;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.reflection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.volunteer-name {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
}

.reflection-date {
  font-size: 12px;
  color: #666;
  font-style: italic;
}

.reflection-content {
  color: #444;
  line-height: 1.6;
  font-size: 14px;
}

/* Analytics Enhancements */
.subtitle {
  font-size: 12px;
  color: #666;
  font-style: italic;
  display: block;
  margin-top: 5px;
}

/* Progress Section */
.progress-section {
  background: #f2f4ec;
  padding: 20px;
  border-radius: 12px;
  margin: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.progress-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 15px;
}

.progress-card {
  background: #f2f4ec;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

  border-left: 4px solid #435739;
}

.progress-card h6 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 14px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin: 8px 0;
}

.progress-fill {
  height: 100%;
  background: #81a263;
  transition: width 0.3s ease;
}

.progress-fill.target {
  background: #f39c12;
}

/* Attendance Stats */
.attendance-stats {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
}

.stat-value.present {
<<<<<<< HEAD
  color: #6b7c61;
=======
  color: #435739;
}

.stat-value.no-time-out {
  color: #ff9800;
>>>>>>> 71bff5e1b2c49db968d756e499a3a2b0d0a59554
}

.stat-value.absent {
  color: #e74c3c;
}

.stat-value.rate {
  color: #6b7c61;
}

/* Things Brought Stats */
.things-brought-stats {
  padding: 15px 0;
}

.total-items {
  text-align: center;
  margin-bottom: 20px;
}

.big-number {
  display: block;
  font-size: 36px;
  font-weight: bold;
  color: #81a263;
}

.label {
  font-size: 14px;
  color: #666;
}

.items-breakdown {
  max-height: 200px;
  overflow-y: auto;
}

.item-stat {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.item-name {
  font-weight: 500;
  color: #2c3e50;
}

.item-count {
  color: #81a263;
  font-weight: bold;
}

.program-stats,
.time-stats {
  margin-top: 15px;
}

.program-item {
  margin-bottom: 15px;
}

.program-name {
  font-weight: 500;
  color: #2c3e50;
  display: block;
  margin-bottom: 5px;
}

.program-count {
  font-size: 14px;
  color: #666;
  float: right;
}

.program-bar {
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 5px;
  clear: both;
}

.program-fill {
  height: 100%;
  background: #81a263;
  transition: width 0.3s ease;
}

/* Time Analysis */
.time-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.time-item {
  background: white;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #81a263;
}

.time-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.time-value {
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
}

/* Responsive Design */
@media (max-width: 768px) {
  .progress-cards {
    grid-template-columns: 1fr;
  }

  .time-stats {
    grid-template-columns: 1fr;
  }

  .attendance-stats {
    flex-direction: column;
    gap: 10px;
  }

  /* Mobile responsive for modern table */
  .modern-table-container {
    margin: 10px 0;
    border-radius: 12px;
  }

  .table-header {
    padding: 12px 16px;
  }

  .table-header h6 {
    font-size: 14px;
  }

  .modern-users-table {
    font-size: 12px;
  }

  .modern-users-table th,
  .modern-users-table td {
    padding: 12px 8px;
  }

  .volunteer-info {
    gap: 8px;
  }

  .volunteer-avatar {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .volunteer-details .name {
    font-size: 13px;
  }

  .volunteer-details .program {
    font-size: 10px;
    padding: 1px 6px;
  }

  .time-badge,
  .no-time-badge,
  .duration-badge,
  .no-duration-badge {
    padding: 6px 8px;
    font-size: 11px;
    gap: 4px;
  }

  .time-cell,
  .duration-cell {
    min-width: 100px;
  }

  .volunteer-name-cell {
    min-width: 150px;
  }
}

@media (max-width: 480px) {
  .modern-table-wrapper {
    max-height: 400px;
  }

  .th-content span {
    display: none;
  }

  .th-content i {
    font-size: 18px;
  }

  .volunteer-details .program {
    display: none;
  }

  .time-badge span,
  .no-time-badge span,
  .duration-badge span,
  .no-duration-badge span {
    font-size: 10px;
  }
}

/* Volunteer Duration Container - Increased Height */
.volunteer-duration-container {
  height: 520px !important; /* Increased from 420px to 520px */
  display: flex;
  flex-direction: column;
}

.volunteer-duration-container .title-graph {
  margin-bottom: 15px;
  flex-shrink: 0;
}

.volunteer-duration-container .bar-chart-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-height: 450px; /* Ensure chart doesn't exceed container */
}

/* Responsive design for volunteer duration container */
@media (max-width: 768px) {
  .volunteer-duration-container {
    height: 450px !important;
    padding: 20px;
  }

  .volunteer-duration-container .bar-chart-container {
    max-height: 380px;
  }
}

@media (max-width: 480px) {
  .volunteer-duration-container {
    height: 400px !important;
    padding: 15px;
  }

  .volunteer-duration-container .bar-chart-container {
    max-height: 330px;
  }
}
</style>
