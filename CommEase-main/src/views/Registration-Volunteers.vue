<template>
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

  <!-- OVERLAY (Para i-disable background) -->
  <div
    class="overlay"
    v-if="showNotifications"
    @click="toggleNotifications"
  ></div>

  <!-- REGISTRATION PART -->

  <!-- THINGS THAT YOU NEED -->
  <div class="registration-upper" :class="{ 'sidebar-collapsed': !isOpen }">
    <h1 class="title-registration">Registration Form</h1>
    <hr class="registration-hr" />
  </div>

  <!-- iterate the values of the RegistrationForm -->
  <div
    class="registration-wrapper"
    v-for="registration in registrationForm"
    :key="registration.id"
  >
    <div class="left-cont" :class="{ 'sidebar-collapsed-left-cont': !isOpen }">
      <div
        class="container-things-needed"
        :class="{ 'disabled-form': !agreed }"
      >
        <h2 class="title-things">Things that you need:</h2>

        <div class="container-button-things">
          <button
            v-for="(item, index) in itemsNeeded"
            :key="index"
            :class="[
              'button-things',
              { 'active-button': selectedItems.includes(item) },
            ]"
            :disabled="!agreed"
            @click="toggleItem(item)"
          >
            {{ item }}
          </button>
        </div>

        <div class="button-submit">
          <button
            class="button-things-back"
            :disabled="!agreed"
            @click="resetRegistration"
          >
            Back
          </button>
          <button
            class="button-things-submit"
            :disabled="!agreed"
            @click="handleSubmit"
          >
            Submit
          </button>
        </div>
      </div>

      <!-- Submit Ideas -->
      <div class="container-ideas">
        <h2 class="title-ideas">Ideas & Recommendations</h2>
        <p class="p-ideas">
          Is there anything that you could recommend for improving our event
          soon? (optional)
        </p>

        <textarea
          v-model="ideaMessage"
          class="message-ideas"
          placeholder="Your message here..."
        >
        </textarea>

        <button class="button-ideas-submit" @click="handleSubmit">
          Submit
        </button>
      </div>
    </div>

    <!-- SPECIFIC EVENT -->
    <div
      class="container-event-objectives"
      :class="{ 'sidebar-collapsed-right-cont': !isOpen }"
    >
      <div v-if="loading" class="loading-message">Loading event details...</div>
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>
      <div v-else-if="event" class="event-details">
        <h2 class="title-event-objectives">{{ event.event_title }}</h2>
        <p class="p-date">
          <span>Date Posted: </span>{{ formatDate(event.created_at) }}
        </p>
        <p class="p-slots"><span>Date: </span>{{ formatDate(event.date) }}</p>
        <p class="p-slots">
          <span>Time: </span>{{ formatTime(event.start_time) }} -
          {{ formatTime(event.end_time) }}
        </p>
        <p class="p-location">
          <span>Location: </span>Barangay {{ event.barangay }}
        </p>

        <h3 class="title-desc">Description</h3>
        <hr class="hr-desc" />

        <p class="p-desc">
          {{ event.description }}
        </p>

        <hr class="hr-task" />
        <h3 class="title-task">Objectives</h3>

        <div class="task-separation">
          <div class="task-bullet-points">
            <p class="p-per-task">• {{ event.objective }}</p>
          </div>
        </div>

        <h3 class="title-task">Things Needed</h3>
        <div class="task-separation">
          <div class="task-bullet-points">
            <p
              v-for="(item, index) in event.things_needed"
              :key="index"
              class="p-per-task"
            >
              • {{ item }}
            </p>
          </div>
        </div>

        <p class="task-note">
          <i class="i-task-note">
            <span class="span-take-note">Note: </span>
            By clicking agree, you accept the invitation and be a part of this
            community service.
          </i>
        </p>
        <hr class="hr-note" />

        <div class="button-specific-event">
          <button
            class="button-things-back"
            :disabled="!agreed"
            @click="resetRegistration"
          >
            Back
          </button>
          <button class="button-things-submit" @click="handleAgree">
            Agree
          </button>
        </div>
      </div>
      <div v-else class="no-event-message">No event details available.</div>
    </div>
  </div>

  <div class="overlay" v-if="!isMobile && isSidebarOpen"></div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { authService, eventService } from "../api/services";
import api from "../api/axios";

// === Sidebar Toggle ===
const isSidebarOpen = ref(true);
const isOpen = ref(false);
const isMobile = ref(false);
const route = useRoute();
const router = useRouter();

// === Event Data ===
const event = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchEventDetails = async () => {
  try {
    loading.value = true;
    error.value = null;
    console.log("Fetching event details for ID:", route.params.id);

    // Direct API call to test
    const response = await api.get(`/events/${route.params.id}`, {
      params: {
        include: "organizer,volunteers",
      },
    });

    console.log("Event response:", response);
    if (response.data && response.data.data) {
      event.value = response.data.data;
      console.log("Event data set:", event.value);
    } else {
      throw new Error("Invalid response format");
    }
  } catch (err) {
    console.error("Error details:", err);
    error.value =
      err.response?.data?.message || "Failed to fetch event details";
    console.error("Error fetching event:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  console.log("Component mounted, route params:", route.params);
  if (route.params.id) {
    await fetchEventDetails();
  } else {
    error.value = "No event ID provided";
    loading.value = false;
  }
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  isOpen.value = !isOpen.value;
};
// === Notifications ===
const showNotifications = ref(false);
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

// === Notifications Data ===
const notifications = ref([
  {
    message: 'You completed the "Update website content" task.',
    time: "2 hours ago",
  },
  { message: 'You completed the "Clean up drive" task.', time: "3 hours ago" },
  {
    message: 'You completed the "Meeting with organizers" task.',
    time: "5 hours ago",
  },
]);

// === Logout Modal ===
const showLogoutModal = ref(false);

const confirmLogout = async () => {
  try {
    await authService.logout();
    showLogoutModal.value = false;
    router.push("/LoginVolunteers");
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Failed to logout. Please try again.");
  }
};

const registrationForm = ref([
  /* ADDED */
  {
    id: 1,
    title: "Clean Up Drive",
    date_posted: "March 1, 2025",
    location: "Olongapo City",
    description: "lorem*4",
    objectives: "lorem*4", // task assignment
  },
]);

// === Registration Form ===
const agreed = ref(false);

// Use the event's things_needed list
const itemsNeeded = computed(() => {
  return event.value?.things_needed || [];
});
const selectedItems = ref([]);

const toggleItem = (item) => {
  if (selectedItems.value.includes(item)) {
    selectedItems.value = selectedItems.value.filter((i) => i !== item);
  } else {
    selectedItems.value.push(item);
  }
};

const handleAgree = () => {
  if (agreed.value) return;

  const confirmed = window.confirm("Are you sure you want to agree?");
  if (confirmed) {
    agreed.value = true;
  }
};

// === Ideas & Recommendations Form ===
const ideaMessage = ref("");

const handleSubmit = async () => {
  if (!agreed.value) {
    alert("Please agree to the terms first.");
    return;
  }

  if (selectedItems.value.length === 0) {
    alert("Please select at least one item to bring.");
    return;
  }

  try {
    // First register for the event
    await api.post(`/events/${event.value.id}/register`);

    // Then submit the things they will bring
    await api.post(`/events/${event.value.id}/things-brought`, {
      thingsBrought: selectedItems.value,
    });

    // If there's a recommendation, submit it as a suggestion
    if (ideaMessage.value.trim()) {
      await api.post(`/events/${event.value.id}/suggestions`, {
        suggestion: ideaMessage.value,
      });
    }

    alert("Registration successful!");
    router.push("/DashboardVolunteers");
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to register for event";
    alert(errorMessage);
    console.error("Registration error:", error);
  }
};

const resetRegistration = () => {
  agreed.value = false;
  selectedItems.value = [];
  ideaMessage.value = "";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const time = new Date(timeStr);
  return time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
</script>

<style scoped src="/src/assets/CSS Volunteers/registration.css"></style>
