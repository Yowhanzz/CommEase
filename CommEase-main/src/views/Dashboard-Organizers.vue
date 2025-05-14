<template>
	<header>
		<!-- Sidebar -->
		<div :class="['sidebar', { open: isSidebarOpen }]">
			<div class="top">
				<div class="logo">
					<i class="bx bxl-codeopen"></i>
					<span class="title-name" v-show="isSidebarOpen"
						>CommEase</span
					>
				</div>
				<i class="bx bx-menu" id="btn" @click="toggleSidebar"></i>
			</div>

			<ul>
				<li>
					<router-link to="/DashboardOrganizers">
						<i class="bx bxs-dashboard"></i>
						<span class="nav-item" v-show="isSidebarOpen"
							>Dashboard</span
						>
					</router-link>
				</li>
				<li>
					<router-link to="/ActivityLogOrganizers">
						<i class="bx bx-history"></i>
						<span class="nav-item" v-show="isSidebarOpen"
							>Event History</span
						>
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
						<span class="nav-item" v-show="isSidebarOpen"
							>Notifications</span
						>
					</a>
				</li>
				<li @click="showLogoutModal = true">
					<a>
						<i class="bx bxs-log-out"></i>
						<span class="nav-item" v-show="isSidebarOpen"
							>Logout</span
						>
					</a>
				</li>
			</ul>
		</div>
	</header>


<!-- SEARCH AND OPTIONS -->
  <div class="search-options-container" :class="{ 'sidebar-collapsed': !isOpen }">
    <div class="dropdown">
      <button class="dropbtn" @click="toggleDropdown">Options ▼</button>
      <div class="dropdown-content" :class="{ active: showDropdown }">
        <a @click="showQRCode = true">Show My QR Scanner</a>
        <a @click="toggleCalendar">Calendar</a>
      </div>
    </div>

    <input
      v-model="searchQuery"
      class="input-search-event"
      type="search"
      placeholder="Search event..."
    />
  </div>

  <hr class="search-divider" :class="{ 'sidebar-collapsed-for-divider': isOpen }" />

  <!-- Modal for QR Code Scanner -->
  <div v-if="showQRCode" class="qr-modal-overlay">
    <div class="qr-modal-content">
      <button class="close-btn" @click="showQRCode = false" v-if="showQRCode">X</button>
      <h3>Scan QR Code</h3>
      <qrcode-stream
  @detect="onDetect"
  class="scanner-box"
  :constraints="{
    video: {
      facingMode: 'environment',
      frameRate: { ideal: 60, max: 60 }
    }
  }"
/>

    <p class="or">or</p>

    <div class="input-attendance-volunteer">
     <input
      v-model="studentID"
      class="input-attendance"
      type="text"
      placeholder="Input your student ID here..."
    />
    <button class="input-submit" @click="submitID">Submit</button>
    </div>


    </div>
  </div>


<!-- CALENDAR MODAL -->
<div v-if="calendarVisible" class="calendar-modal-overlay">
  <div class="calendar-modal">
    <div class="calendar-header">
      <h3>Event Calendar</h3>
      <button class="close-btn" @click="calendarVisible = false">✕</button>
    </div>
    <vue-cal style="height: 500px" :events="events" @cell-click="onDateClick" />
  </div>
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
					<button @click="confirmLogout" class="logout-btn">
						Logout
					</button>
				</div>
			</div>
		</div>
		
	<!-- NOTIFICATION PANEL -->
	<div class="notification-panel" :class="{ open: showNotifications }">
		<div class="notification-header">
			<h3>Notifications</h3>
			<span class="close-btn" @click="toggleNotifications">&times;</span>
		</div>
		<div class="notification-list">
			<div
				class="notification-item"
				v-for="(notif, index) in notifications"
				:key="index"
			>
				<h4>{{ notif.message }}</h4>
				<p class="time">{{ notif.time }}</p>
			</div>
		</div>
	</div>

	<!-- USER INFO -->
	<div class="container" :class="{ 'sidebar-collapsed': !isOpen }">
		<div class="glasscard-container">
			<div class="picture-1">
				<img
					src=""
					alt="shrek sample pic"
					class="picture-person"
				/>
			</div>
			<div class="glasscard-titles">
				<h1 class="volunteer-name">Hello, Ridley!</h1>
				<h6 class="service-type">Organizer</h6>
			</div>
		</div>

		<div class="glasscard-container-1">
			<div class="picture-1">
				<img
					src=""
					alt="shrek sample pic"
					class="picture-person"
				/>
			</div>
			<div class="glasscard-titles">
				<h1 class="volunteer-name">Mon, Mar 27, 2025</h1>
				<h6 class="service-type">40 °C</h6>
			</div>
		</div>
	</div>

	<!-- EVENTS LIST -->
	<div class="container-events test" :class="{ 'sidebar-collapsed': !isOpen }">
		<div>
			<h1 class="lists-events">CREATED EVENTS</h1>
			<hr class="hr-lists-events" />
		</div>   

    <router-link to="/CreateEventOrganizers" class="create-event-button">Create Event</router-link>

		<div class="events-grid">
			<div
				v-for="(event, index) in filteredEvents"
				:key="index"
				class="container-glasscard-events"
			>
				<div class="container-inputs">
					<div class="container-inputs-info">
						<h1 class="container-event-title">{{ event.title }}</h1>
						<h6 class="container-event-location">
							{{ event.location }}
						</h6>
						<h6 class="container-event-time">
							{{ formatTime(event.start) }} -
							{{ formatTime(event.end) }}
						</h6>
						<h6 class="container-event-date">
							{{ formatDate(event.start) }}
						</h6>
					</div>
					<div class="button">
            <router-link
							to="/EditEventOrganizers"
							class="button-edit"
							>Edit</router-link
						>
						<router-link
							to="/AnalyticsOrganizers"
							class="button-enter"
							>Enter</router-link
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import 'vue-cal/dist/vuecal.css';
import VueCal from 'vue-cal';
import { QrcodeStream } from 'vue-qrcode-reader';


export default {
  components: {
    VueCal,
    QrcodeStream,
  },
  data() {
    return {
      searchQuery: "",
      studentID: "",
      timedIDs: new Set(),
      showDropdown: false,
      showNotifications: false,
      showLogoutModal: false,
      isSidebarOpen: false,
      isOpen: false,
      qrData: "sample-qr-data",
      calendarVisible: false, // ✅ for toggling calendar visibility
      selectedEvent: null,
      showQRCode: false, // for QR scanner modal visibility

      notifications: [
        { message: "You completed the 'Update website content' task.", time: "2 hours ago" },
        { message: "You completed the 'Clean up drive' task.", time: "3 hours ago" },
        { message: "You completed the 'Meeting with organizers' task.", time: "5 hours ago" },
      ],

      events: [
        {
          start: "2025-04-08T10:00:00",
          end: "2025-04-08T12:00:00",
          title: "Clean Up Drive",
          location: "Barangay East Bajac-Bajac",
        },
        {
          start: "2025-09-10T08:00:00",
          end: "2025-09-10T10:00:00",
          title: "Tree Planting",
          location: "Barangay West Tapinac",
        },
				 {
          start: "2025-09-10T08:00:00",
          end: "2025-09-10T10:00:00",
          title: "Tree Planting",
          location: "Barangay West Tapinac",
        },
				 {
          start: "2025-09-10T08:00:00",
          end: "2025-09-10T10:00:00",
          title: "Tree Planting",
          location: "Barangay West Tapinac",
        },
				 {
          start: "2025-09-10T08:00:00",
          end: "2025-09-10T10:00:00",
          title: "Tree Planting",
          location: "Barangay West Tapinac",
        },
				 {
          start: "2025-09-10T08:00:00",
          end: "2025-09-10T10:00:00",
          title: "Tree Planting",
          location: "Barangay West Tapinac",
        },
        // Add other events here...
      ],
    };
  },
  computed: {
    filteredEvents() {
      return this.events.filter((event) =>
        event.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    // Toggle Sidebar
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
      this.isOpen = !this.isOpen;
    },

    // Dropdown Toggle
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },

    // Calendar Toggle
    toggleCalendar() {
      this.calendarVisible = !this.calendarVisible;
      this.showDropdown = false;
    },

    submitID() {
      const id = this.studentID.trim();

      // Check if only numbers
      if (!/^\d+$/.test(id)) {
        alert("Student ID must contain only numbers.");
        return;
      }

      // Check if it's exactly 9 digits
      if (id.length !== 9) {
        alert("Student ID must be exactly 9 digits.");
        return;
      }

      // Check if the ID is already in the set (time out scenario)
      if (this.timedIDs.has(id)) {
        alert("Time out successfully!");
        this.timedIDs.delete(id); // Remove from timed-in list
      } else {
        alert("Time in successfully!");
        this.timedIDs.add(id); // Add to timed-in list
      }

      // Clear the input field after submit
      this.studentID = "";
    },

    // QR Scanner Modal Logic
onDetect(result) {
  const scannedText = result[0].rawValue;
  alert(`✅ Scanned Successfully: ${scannedText}`);
  // this.showQRCode = false; // ❌ Huwag muna i-auto-close, manual na lang
},

 onInit(error) {
  if (error) {
    console.error("🚨 QR Scanner initialization error:", error.name);
    alert(`❌ Camera access issue: ${error.name}`);
  } else {
    console.log("✅ QR Scanner initialized successfully.");
  }
},

    // Event Click Logic (for calendar)
    onDateClick({ date }) {
      const selected = this.events.find((event) => {
        const eventDate = new Date(event.start).toLocaleDateString();
        return eventDate === new Date(date).toLocaleDateString();
      });
      this.selectedEvent = selected || null;
      if (selected) {
        console.log("Clicked Event:", selected);
      } else {
        console.log("No event on selected date.");
      }
    },

    // Notification Toggle
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },

    // Format Time
    formatTime(datetime) {
      return new Date(datetime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    // Format Date
    formatDate(datetime) {
      return new Date(datetime).toLocaleDateString([], {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },

    // Logout Logic
    confirmLogout() {
      console.log("Logging out...");
      this.showLogoutModal = false;
    },

    // Show Content Logic (for modal handling)
    showContent(type) {
      this.activeContent = type;
      this.showDropdown = false;
    },

    // Close Modal
    closeModal() {
      this.activeContent = null;
    },
  },
};
</script>


<style scoped src="/src/assets/CSS Organizers/dashboard.css"></style>
