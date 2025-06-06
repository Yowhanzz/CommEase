<template>
  <!-- NOTIFICATION PANEL -->
  <div class="notification-panel" :class="{ open: isOpen }">
    <div class="notification-header">
      <h2>Notifications</h2>
      <i class="bx bx-x close-btn" @click="closeNotifications"></i>
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
  <div class="overlay" v-if="isOpen" @click="closeNotifications"></div>
</template>

<script>
export default {
  name: "Notifications",

  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      notifications: [
        {
          message: 'You completed the "Update website content" task.',
          time: "2 hours ago",
        },
        {
          message: 'You completed the "Clean up drive" task.',
          time: "3 hours ago",
        },
        {
          message: 'You completed the "Meeting with organizers" task.',
          time: "5 hours ago",
        },
      ],
    };
  },

  methods: {
    closeNotifications() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
/* NOTIFICATION PANEL */
.notification-panel {
  position: fixed;
  top: 0;
  left: -300px; /* Initially off-screen to the left */
  width: 300px;
  height: 100%;
  background: #c6c3bd;
  color: #daf1de;
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.3);
  z-index: 2000;
  padding: 15px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-in-out; /* Smooth glide transition */
}

/* Close button */
.notification-panel .close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 30px;
  cursor: pointer;
  color: white;
  transition: 0.15s ease-in-out opacity;
}

/* Slide in effect */
.notification-panel.open {
  transform: translateX(300px); /* Slides in from the left */
}

/* Close button hover effect */
.notification-panel .close-btn:hover {
  opacity: 0.6;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
  color: black;
}

.close-btn {
  font-size: 24px;
  cursor: pointer;
}

.notification-list {
  margin-top: 10px;
}

.notification-item {
  background: rgba(255, 255, 255, 0.2);
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  color: black;
  transition: 0.15s ease-in-out background-color, 0.15s ease-in-out color;
}

.notification-item:hover {
  background-color: #859972;
  color: #daf1de;
}

.notification-item:hover .time {
  color: #daf1de; /* Change the color of the span.time on hover */
}

.notification-item h4 {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
}

.notification-item p {
  font-size: 12px;
  margin: 5px 0;
}

.notification-item .time {
  font-size: 10px;
  color: black;
}

.notification-item .time:hover {
  color: #313131;
}
</style>
