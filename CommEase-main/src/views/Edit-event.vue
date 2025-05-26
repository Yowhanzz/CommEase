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

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
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
    const programFilters = ref([]);
    const organizer = ref("");
    const status = ref("");
    const objective = ref("");
    const description = ref("");
    const thingsNeeded = ref([]);
    const newThing = ref("");

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
    onMounted(() => {
      event_id.value = route.query.event_id;
      const events = JSON.parse(localStorage.getItem("events")) || [];
      const existingEvent = events.find((e) => e.event_id == event_id.value);

      if (existingEvent) {
        title.value = existingEvent.title ?? "";
        barangay.value = existingEvent.barangay ?? "";
        date.value = existingEvent.date ?? "";
        const [start = "", end = ""] = (existingEvent.time ?? "").split(" - ");
        startTime.value = start.trim();
        endTime.value = end.trim();
        organizer.value = existingEvent.organizer ?? "";
        status.value = existingEvent.status ?? "";
        objective.value = existingEvent.objective ?? "";
        description.value = existingEvent.description ?? "";
        thingsNeeded.value = existingEvent.thingsNeeded ?? [];
        programs.value = existingEvent.programs ?? [];
      } else {
        alert("Event not found.");
        router.push("/DashboardOrganizers");
      }
    });

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
      isOpen.value = !isOpen.value;
    };

    const handleResize = () => {
      /* ADDED */
      this.isMobile = window.innerWidth <= 928;
      if (this.isMobile) {
        this.isSidebarOpen = false;
      }
    };

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };

    const confirmLogout = () => {
      router.push("/login");
    };

    const addThing = () => {
      const trimmed = newThing.value.trim();
      if (trimmed) {
        thingsNeeded.value.push(trimmed);
        newThing.value = "";
      }
    };

    const removeThing = (index) => {
      thingsNeeded.value.splice(index, 1);
    };

    const cancelEdit = () => {
      title.value = "";
      barangay.value = "";
      date.value = "";
      startTime.value = "";
      endTime.value = "";
      organizer.value = "";
      status.value = "";
      objective.value = "";
      description.value = "";
      programs.value = [];
      thingsNeeded.value = [];
      newThing.value = "";
    };

    const saveChanges = () => {
      if (
        !title.value.trim() ||
        !barangay.value.trim() ||
        !date.value.trim() ||
        !startTime.value.trim() ||
        !endTime.value.trim() ||
        !organizer.value.trim() ||
        !status.value.trim() ||
        !objective.value.trim() ||
        !description.value.trim() ||
        programs.value.length === 0 ||
        thingsNeeded.value.length === 0
      ) {
        alert("You need to fill all the required input");
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selectedDate = new Date(date.value);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        alert("Your date is no longer available.");
        return;
      }

      const events = JSON.parse(localStorage.getItem("events")) || [];
      const index = events.findIndex((e) => e.event_id == event_id.value);

      if (index !== -1) {
        events[index] = {
          ...events[index],
          title: title.value,
          barangay: barangay.value,
          date: date.value,
          time: `${startTime.value} - ${endTime.value}`,
          organizer: organizer.value,
          status: status.value,
          objective: objective.value,
          description: description.value,
          programs: [...programs.value],
          thingsNeeded: [...thingsNeeded.value],
        };

        localStorage.setItem("events", JSON.stringify(events));
        alert("Event updated!");
        router.push("/DashboardOrganizers");
      } else {
        alert("Event not found.");
      }
    };

    return {
      isSidebarOpen,
      showNotifications,
      showLogoutModal,
      searchQuery,
      isOpen,
      isMobile,
      event_id,
      title,
      barangay,
      date,
      startTime,
      endTime,
      programs,
      programFilters,
      organizer,
      status,
      objective,
      description,
      thingsNeeded,
      newThing,
      notifications,
      toggleSidebar,
      toggleNotifications,
      confirmLogout,
      addThing,
      removeThing,
      cancelEdit,
      saveChanges,
    };
  },
};
</script>

<style scoped src="/src/assets/CSS Organizers/edit-event.css"></style>
