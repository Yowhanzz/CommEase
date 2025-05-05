<template>
 <header>
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
      <router-link to="/dashboard_volunteers">
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
  </header>

    <!-- NOTIFICATION PANEL -->
    <div class="notification-panel" :class="{'open': showNotifications}">
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

    <!-- OVERLAY (Para i-disable background) -->
    <div class="overlay" v-if="showNotifications" @click="toggleNotifications"></div>


  <!-- REGISTRATION PART -->

  <!-- Things that you need -->
  <h1 class="title-registration">Registration Form</h1>
  <hr class="registration-hr">

  <div class="container-things-needed">
    <h2 class="title-things">Things that you need:</h2>

    <div class="container-button-things">
      <button 
        v-for="(item, index) in itemsNeeded" 
        :key="index" 
        :class="['button-things', { 'active-button': selectedItems.includes(item) }]"
        @click="toggleItem(item)">
        {{ item }}
      </button>
    </div>

    <div class="button-submit">
      <button class="button-things-back">Back</button>
      <button class="button-things-submit">Submit</button>
    </div>
  </div>

  <!--Submit Ideas -->

  <div class="container-ideas">
    <h2 class="title-ideas">Ideas & Recommendations</h2>
    <p class="p-ideas">Is there anything that you could recommend for
      improving our event soon? (optional)</p>

      <textarea class="message-ideas" placeholder="Your message here..."></textarea>
      <button class="button-ideas-submit">Submit</button>
  </div>

 <!-- SPECIFIC EVENT -->

  <div class="container-event-objectives">
    <h2 class="title-event-objectives">CLEAN UP DRIVE</h2>
    <p class="p-date"><span>Date Posted: </span>08/04.2005</p>
    <p class="p-location"><span>Location </span>#25 21st East Bajac-Bajac, Olongapo City</p>
    <p class="p-slots"><span>Slots Left: </span>Only <span>25</span> volunteers are in need</p>

    <h3 class="title-desc">Description</h3>
    <hr class="hr-desc">

    <p class="p-desc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
       ipsam nemo dicta, veritatis omnis mollitia quas autem animi sapiente, 
       totam consectetur at aut quod nihil odit distinctio temporibus sint culpa delectus
        sed et sit doloribus rerum. Repellendus repellat in minima. Cupiditate veritatis 
        vel ut quos doloremque mollitia recusandae sunt, facilis assumenda praesentium 
        numquam eius itaque voluptatem quidem quibusdam neque debitis voluptatum id 
        voluptatibus laudantium totam iure! Repellat harum neque, veniam ut nisi aperiam 
        odio consequuntur vel distinctio consequatur, repudiandae delectus!</p>

    <hr class="hr-task">
    <h3 class="title-task">Task Assignment</h3>

    <div class="task-separation">

      <div class="task-bullet-points">
        <p class="p-per-task">• Plant a tree</p>
        <p class="p-per-task">• tanggalin ang mga dwende</p>
        <p class="p-per-task">• hanapin ang sigarilyo ng kapre</p>
        <p class="p-per-task">• mag sibak ng kahoy</p>
        <p class="p-per-task">• makipag biruan sa unggoy</p>
      </div>

      <div class="task-bullet-points">
        <p class="p-per-task">• Plant a tree</p>
        <p class="p-per-task">• tanggalin ang mga dwende</p>
        <p class="p-per-task">• hanapin ang sigarilyo ng kapre</p>
        <p class="p-per-task">• mag sibak ng kahoy</p>
        <p class="p-per-task">• makipag biruan sa unggoy</p>
      </div>
    </div>

    <p class="task-note"><i class="i-task-note"><span class="span-take-note">Note: </span>By clicking agree, you accept the invitation and be a part of this community service.</i></p>
      <hr class="hr-note">

      <div class="button-specific-event">
      <button class="button-things-back">Back</button>
      <button class="button-things-submit">Agree</button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// List of items
const itemsNeeded = ref(["Shovel", "Rake", "Gloves", "Boots", "Helmet"]);

// Store selected items
const selectedItems = ref([]);

// Function to toggle selection
const toggleItem = (item) => {
  if (selectedItems.value.includes(item)) {
    // If already selected, remove it
    selectedItems.value = selectedItems.value.filter(i => i !== item);
  } else {
    // Otherwise, select it
    selectedItems.value.push(item);
  }
};

// Notifications (if needed)
const showNotifications = ref(false);
const notifications = ref([
  { message: 'You completed the "Update website content" task.', time: '2 hours ago' },
  { message: 'You completed the "Clean up drive" task.', time: '3 hours ago' },
  { message: 'You completed the "Meeting with organizers" task.', time: '5 hours ago' }
]);

// Function to toggle notifications
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

// Logout Modal
const showLogoutModal = ref(false);
const router = useRouter();

const confirmLogout = () => {
  showLogoutModal.value = false;
  router.push("/login"); // Redirect to login page after logout
};

// Event data
const events = ref([
  { title: "Clean Up Drive", barangay: "East Bajac - Bajac", date: "08/06/2025", time: "10:00 - 12:00", organizer: "ELITES" },
  { title: "Tree Planting", barangay: "West Bajac - Bajac", date: "09/10/2025", time: "8:00 - 10:00", organizer: "GREEN INITIATIVE" },
  { title: "Feeding Program", barangay: "North Bajac - Bajac", date: "10/12/2025", time: "2:00 - 4:00", organizer: "HELPING HANDS" },
  { title: "Blood Donation", barangay: "South Bajac - Bajac", date: "12/15/2025", time: "9:00 - 1:00", organizer: "HEALTH TEAM" }
]);

const searchQuery = ref(""); 

// Filter events based on the search query
const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const query = searchQuery.value.toLowerCase();
    return event.title.toLowerCase().includes(query) ||
           event.barangay.toLowerCase().includes(query) ||
           event.date.toLowerCase().includes(query) ||
           event.time.toLowerCase().includes(query) ||
           event.organizer.toLowerCase().includes(query);
  });
});

// === Sidebar Toggle ===
const isSidebarOpen = ref(true);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>


<style scoped src="/src/assets/CSS Volunteers/registration.css"></style>