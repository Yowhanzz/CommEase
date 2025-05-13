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
					<router-link to="/dashboard_volunteers">
						<i class="bx bxs-dashboard"></i>
						<span class="nav-item" v-show="isSidebarOpen"
							>Dashboard</span
						>
					</router-link>
				</li>
				<li>
					<router-link to="/ActivityLogVolunteers">
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

	<div>
		<!-- SEARCH AND OPTIONS -->
		<div
			class="search-options-container"
			:class="{ 'sidebar-collapsed': !isOpen }"
		>
			<div class="dropdown">
				<button class="dropbtn" @click="toggleDropdown">
					Options ▼
				</button>
				<div class="dropdown-content" :class="{ active: showDropdown }">
					<a>Show My QR Code</a>
					<a>Calendar</a>
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
					src="/public/gulapa.jpg"
					alt="shrek sample pic"
					class="picture-person"
				/>
			</div>
			<div class="glasscard-titles">
				<h1 class="volunteer-name">Hello, Johannes!</h1>
				<h6 class="service-type">Volunteer</h6>
			</div>
		</div>

		<div class="glasscard-container-1">
			<div class="picture-1">
				<img
					src="/public/gulapa.jpg"
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
			<h1 class="lists-events">LISTS OF EVENTS</h1>
			<hr class="hr-lists-events" />
		</div>

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
							to="/RegistrationVolunteers"
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
export default {
	data() {
		return {
			searchQuery: "",
			showDropdown: false,
			activeContent: null,
			showNotifications: false,
			showLogoutModal: false,
			isSidebarOpen: false, // copy
			showDropdown: false,
			isOpen: false, // copy
			qrData: "sample-qr-data",
			notifications: [
				{
					message: "You completed the 'Update website content' task.",
					time: "2 hours ago",
				},
				{
					message: "You completed the 'Clean up drive' task.",
					time: "3 hours ago",
				},
				{
					message:
						"You completed the 'Meeting with organizers' task.",
					time: "5 hours ago",
				},
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
					start: "2025-12-15T14:00:00",
					end: "2025-12-15T16:00:00",
					title: "Feeding Program",
					location: "Barangay Sta. Rita",
				},
				{
					start: "2025-05-20T09:00:00",
					end: "2025-05-20T11:00:00",
					title: "Community Painting",
					location: "Barangay Sta. Rita Gymnasium",
				},
				{
					start: "2025-06-01T13:00:00",
					end: "2025-06-01T15:00:00",
					title: "Barangay Forum",
					location: "Barangay East Tapinac Covered Court",
				},
				{
					start: "2025-07-07T08:30:00",
					end: "2025-07-07T11:30:00",
					title: "Blood Donation Drive",
					location: "Olongapo City Health Office",
				},
			],
			selectedEvent: null,
		};
	},
	computed: {
		filteredEvents() {
			return this.events.filter(
				(event) =>
					event.title
						.toLowerCase()
						.includes(this.searchQuery.toLowerCase()) ||
					event.location
						.toLowerCase()
						.includes(this.searchQuery.toLowerCase())
			);
		},
	},
	methods: {
		toggleSidebar() {
			this.isSidebarOpen = !this.isSidebarOpen;
			this.isOpen = !this.isOpen; // toggles both  :class="{ 'sidebar-collapsed': !isOpen }"
		}, // copyy
		toggleDropdown() {
			this.showDropdown = !this.showDropdown;
		},
		showContent(type) {
			this.activeContent = type;
			this.showDropdown = false;
		},
		closeModal() {
			this.activeContent = null;
		},
		toggleNotifications() {
			this.showNotifications = !this.showNotifications;
		},
		formatTime(datetime) {
			return new Date(datetime).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
		},
		formatDate(datetime) {
			return new Date(datetime).toLocaleDateString([], {
				weekday: "short",
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		},
		onDateClick(date) {
			const selected = this.events.find((event) => {
				const eventDate = new Date(event.start).toLocaleDateString();
				return eventDate === date.toLocaleDateString();
			});
			this.selectedEvent = selected || null;
		},
		confirmLogout() {
			// Placeholder for logout logic
			console.log("Logging out...");
			this.showLogoutModal = false;
		},
		toggleDropdown() {
			this.showDropdown = !this.showDropdown;
		},
	},
};
</script>

<style scoped src="/src/assets/CSS Volunteers/dashboard.css"></style>
