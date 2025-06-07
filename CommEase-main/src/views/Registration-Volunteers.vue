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
          <router-link to="/safety_protocol">
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
    <!-- SPECIFIC EVENT -->
    <div
      class="container-event-objectives"
      :class="{ 'sidebar-collapsed-right-cont': !isOpen }"
    >
      <div v-if="loading" class="loading-message">Loading event details...</div>
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>
      <div v-else class="event-details">
        <div class="event-info-container">
          <div class="event-header">
            <h2 class="title-event-objectives">{{ registration.title }}</h2>
            <div class="event-meta">
              <p class="p-date">
                <span>Date Posted: </span
                >{{ formatDate(registration.date_posted) }}
              </p>
              <p class="p-slots">
                <span>Date: </span>{{ formatDate(registration.date) }}
              </p>
              <p class="p-slots">
                <span>Time: </span>{{ formatTime(registration.start_time) }} -
                {{ formatTime(registration.end_time) }}
              </p>
              <p class="p-location">
                <span>Location: </span>Barangay {{ registration.location }}
              </p>

              <p class="p-location">
                <span>Slots left: </span>Only 25 Volunteers left
                <!-- registration.slots -->
              </p>

              <p class="p-programs">
                <span>Programs: </span
                >{{ (registration.programs || []).join(", ") }}
              </p>
              <p class="p-organizer">
                <span>Organizer: </span>{{ registration.organizer?.first_name }}
                {{ registration.organizer?.last_name }}
              </p>
            </div>
          </div>

          <div class="event-content">
            <div class="content-section">
              <h3 class="title-desc">Description</h3>
              <hr class="hr-desc" />
              <p class="p-desc">{{ registration.description }}</p>
            </div>

            <div class="content-section">
              <h3 class="title-task">Objectives</h3>
              <hr class="hr-task" />
              <div class="task-separation">
                <div class="task-bullet-points">
                  <p class="p-per-task">• {{ registration.objectives }}</p>
                </div>
              </div>
            </div>

            <!--  <div class="content-section">
              <h3 class="title-task">Things Needed</h3>
              <hr class="hr-task" />
              <div class="task-separation">
                <div class="task-bullet-points">
                  <p
                    v-for="(item, index) in registration.things_needed"
                    :key="index"
                    class="p-per-task"
                  >
                    • {{ item }}
                  </p>
                </div>
              </div>
            </div> -->
          </div>

          <div class="event-footer">
            <p class="task-note">
              <i class="i-task-note">
                <span class="span-take-note">Note: </span>
                By clicking agree, you accept the invitation and be a part of
                this community service.
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
        </div>
      </div>
    </div>
    <div class="left-cont" :class="{ 'sidebar-collapsed-left-cont': !isOpen }">
      <div
        class="container-things-needed"
        :class="{ 'disabled-form': !agreed }"
      >
        <h2 class="title-things">Things that you need:</h2>

        <div class="container-button-things">
          <button
            v-for="(item, index) in registration.things_needed"
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
        <select
          v-model="suggestionCategory"
          class="suggestion-category-dropdown"
        >
          <option value="logistics">Logistics</option>
          <option value="program">Program</option>
          <option value="venue">Venue</option>
          <option value="other">Other</option>
        </select>
        <textarea
          v-model="ideaMessage"
          class="message-ideas"
          placeholder="Your message here..."
        >
        </textarea>
        <!--       <button class="button-ideas-submit" @click="handleSubmit">
          Submit
        </button> -->
      </div>
    </div>
  </div>

  <div class="overlay" v-if="!isMobile && isSidebarOpen"></div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { authService, eventService } from "../api/services";
import { useNotifications } from "@/composables/useNotifications";
import NotificationPanel from "@/components/NotificationPanel.vue"; // Import the notification component

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

const registrationForm = ref([]);

const fetchRegistrationForm = async () => {
  try {
    loading.value = true;
    error.value = null;
    console.log("Fetching event details for ID:", route.params.id);
    const eventData = await eventService.getEvent(route.params.id);
    console.log("Event data:", eventData);
    event.value = eventData;
    // Populate registrationForm with the real event data
    registrationForm.value = [
      {
        id: eventData.id,
        title: eventData.event_title,
        date_posted: eventData.created_at,
        location: eventData.barangay,
        description: eventData.description,
        objectives: eventData.objective,
        programs: eventData.programs,
        organizer: eventData.organizer,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        date: eventData.date,
        things_needed: eventData.things_needed,
      },
    ];
    console.log("Registration form set:", registrationForm.value);
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
  await fetchRegistrationForm();
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  isOpen.value = !isOpen.value;
};
// === Notifications ===
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

// === Registration Form ===
const agreed = ref(false);

// Use the event's things_needed list
const itemsNeeded = computed(() => {
  return event.value?.things_needed || [];
});
const selectedItems = ref([]);

const toggleItem = (item) => {
  const index = selectedItems.value.indexOf(item);
  if (index === -1) {
    // Item is not selected, add it
    selectedItems.value.push(item);
  } else {
    // Item is already selected, remove it
    selectedItems.value.splice(index, 1);
  }
  console.log("Selected items:", selectedItems.value); // Debug log
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
const suggestionCategory = ref("other");

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
    // Register for the event
    const registerResponse = await eventService.register(event.value.id);

    if (registerResponse.status === 200 || registerResponse.status === 201) {
      // Then submit the things they will bring
      await eventService.submitThingsBrought(event.value.id, {
        thingsBrought: selectedItems.value,
      });

      // If there's a recommendation, submit it as a suggestion
      if (ideaMessage.value.trim()) {
        await eventService.submitSuggestion(event.value.id, {
          suggestion: ideaMessage.value,
          category: suggestionCategory.value,
        });
      }

      alert("Registration successful!");
      router.push("/DashboardVolunteers");
    }
  } catch (error) {
    let errorMessage = "Failed to register for event";

    if (error.response?.status === 422) {
      if (error.response.data.message?.includes("already registered")) {
        errorMessage = "You are already registered for this event";
      } else if (
        error.response.data.message?.includes("not available for your program")
      ) {
        errorMessage = "This event is not available for your program";
      } else if (
        error.response.data.message?.includes("Cannot register for this event")
      ) {
        errorMessage = "This event is not in upcoming status";
      } else if (error.response.data.errors) {
        errorMessage = Object.values(error.response.data.errors)
          .flat()
          .join("\n");
      } else {
        errorMessage = error.response.data.message || errorMessage;
      }
    } else if (error.response?.status === 403) {
      errorMessage = "You do not have permission to register for this event";
    }

    console.error("Registration error:", error);
    alert(errorMessage);
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

name: "safety", components: { QrcodeStream, VueCal, VueQrcode,
NotificationPanel, // Register the component },

<style scoped src="/src/assets/CSS Volunteers/registration.css"></style>
