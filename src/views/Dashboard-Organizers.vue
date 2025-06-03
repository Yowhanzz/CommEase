<template>
  <header>
    <!-- Sidebar -->
    <div :class="['sidebar', { open: isSidebarOpen }]">
      <!-- ... existing sidebar code ... -->
    </div>
  </header>

  <!-- USER INFO -->
  <div class="container" :class="{ 'sidebar-collapsed': !isOpen }">
    <div class="glasscard-container">
      <div class="picture-1">
        <img src="" alt="profile-pic" class="picture-person" />
      </div>
      <div class="glasscard-titles">
        <h1 class="volunteer-name">Hello, Ridley!</h1>
        <h6 class="service-type">Organizer</h6>
      </div>
    </div>

    <div class="glasscard-container-1">
      <div class="picture-1">
        <img
          v-if="weather.icon"
          :src="`http://openweathermap.org/img/wn/${weather.icon}@2x.png`"
          :alt="weather.description"
          class="weather-icon"
        />
      </div>
      <div class="glasscard-titles">
        <h1 class="volunteer-name">
          {{
            new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          }}
        </h1>
        <h6 class="service-type">{{ weather.temperature }}°C</h6>
        <p class="weather-description">{{ weather.description }}</p>
      </div>
    </div>
  </div>

  <!-- ... rest of the template ... -->
</template>

<script>
import "vue-cal/dist/vuecal.css";
import VueCal from "vue-cal";
import { QrcodeStream } from "vue-qrcode-reader";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authService, qrService, eventService } from "@/api/services";
import axios from "axios";

export default {
  components: {
    VueCal,
    QrcodeStream,
  },
  setup() {
    const router = useRouter();
    const searchQuery = ref("");
    const selectedStatus = ref("");
    const selectedProgram = ref("");
    const studentID = ref("");
    const scanType = ref("time_in");
    const timedIDs = new Set();
    const showDropdown = ref(false);
    const showNotifications = ref(false);
    const showLogoutModal = ref(false);
    const isSidebarOpen = ref(false);
    const isOpen = ref(false);
    const qrData = ref("sample-qr-data");
    const calendarVisible = ref(false);
    const selectedEvent = ref(null);
    const showQRCode = ref(false);
    const useManualInput = ref(false);
    const notifications = ref([]);
    const events = ref([]);
    const weather = ref({
      temperature: "",
      description: "",
      icon: "",
    });

    // Fetch weather data
    const fetchWeather = async () => {
      try {
        const API_KEY = "476431119c6012c1e8cb59bb59fb3668";
        const city = "Olongapo"; // Default city
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );

        weather.value = {
          temperature: Math.round(response.data.main.temp),
          description: response.data.weather[0].description,
          icon: response.data.weather[0].icon,
        };
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    // Fetch events
    const fetchEvents = async () => {
      try {
        const response = await eventService.getEventsOrganizer();
        events.value = response.data;
      } catch (err) {
        console.error("Failed to fetch organizer events:", err);
      }
    };

    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/api/notifications");
        notifications.value = response.data;
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    onMounted(() => {
      fetchEvents();
      fetchNotifications();
      fetchWeather();
    });

    return {
      searchQuery,
      selectedStatus,
      selectedProgram,
      showDropdown,
      showNotifications,
      showLogoutModal,
      isSidebarOpen,
      isOpen,
      calendarVisible,
      selectedEvent,
      showQRCode,
      useManualInput,
      notifications,
      events,
      weather,
      fetchWeather,
      fetchEvents,
      fetchNotifications,
    };
  },
};
</script>

<style scoped src="/src/assets/CSS Organizers/dashboard.css"></style>
