<template>
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
</template>

<script setup>
import { onMounted } from "vue";

const emit = defineEmits(["toggleNotifications"]);
const props = defineProps({
  showNotifications: {
    type: Boolean,
  },
  notifications: {
    type: Array,
  },
});

onMounted(() => {
  // This is where you can fetch notifications if needed
  console.log(props);
});

const toggleNotifications = () => {
  emit("toggleNotifications");
};

// Optionally, destructure for cleaner template
const { showNotifications, notifications } = props;
</script>
