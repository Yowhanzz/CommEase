<template>
  <!-- NOTIFICATION PANEL -->
  <div class="notification-panel" :class="{ open: isOpen }">
    <div class="notification-header">
      <h2>Notifications</h2>
      <div class="header-actions">
        <button
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="mark-all-read-btn"
          title="Mark all as read"
        >
          Mark all as read
        </button>
        <i class="bx bx-x close-btn" @click="closeNotifications"></i>
      </div>
    </div>
    <div class="notification-list">
      <!-- Loading state -->
      <div v-if="loading" class="loading-state">
        <p>Loading notifications...</p>
      </div>

      <!-- No notifications -->
      <div v-else-if="notifications.length === 0" class="no-notifications">
        <p>No notifications yet</p>
      </div>

      <!-- Notification items -->
      <div
        v-else
        class="notification-item"
        v-for="notification in notifications"
        :key="notification.id"
        :class="{ unread: !notification.read }"
        @click="markAsRead(notification)"
      >
        <div class="notification-content">
          <div class="notification-type-badge" :class="notification.type">
            {{ getNotificationTypeLabel(notification.type) }}
          </div>
          <p class="notification-message">{{ notification.message }}</p>
          <span class="time">{{ notification.time }}</span>
        </div>
        <div class="notification-actions">
          <i
            class="bx bx-trash delete-btn"
            @click.stop="deleteNotification(notification)"
            title="Delete notification"
          ></i>
        </div>
      </div>
    </div>
  </div>

  <!-- OVERLAY (Para i-disable background) -->
  <div class="overlay" v-if="isOpen" @click="closeNotifications"></div>
</template>

<script>
export default {
  name: "NotificationPanel",

  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    notifications: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
  },

  methods: {
    closeNotifications() {
      this.$emit("close");
    },

    markAsRead(notification) {
      if (!notification.read) {
        this.$emit("mark-as-read", notification.id);
      }
    },

    markAllAsRead() {
      this.$emit("mark-all-as-read");
    },

    deleteNotification(notification) {
      if (confirm("Are you sure you want to delete this notification?")) {
        this.$emit("delete-notification", notification.id);
      }
    },

    getNotificationTypeLabel(type) {
      const typeLabels = {
        new_event: "New Event",
        event_started: "Event Started",
        event_ended: "Event Ended",
        event_updated: "Event Updated",
        event_cancelled: "Event Cancelled",
        volunteer_registered: "Volunteer Registered",
        volunteer_unregistered: "Volunteer Unregistered",
        volunteer_time_in: "Time In",
        volunteer_time_out: "Time Out",
        attendance_marked: "Attendance Marked",
        new_feedback: "New Feedback",
        new_post_evaluation: "New Evaluation",
        things_brought_updated: "Items Updated",
      };
      return typeLabels[type] || "Notification";
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
  overflow-y: auto;
  scrollbar-width: thick; /* For Firefox */
  scrollbar-color: #435739; /* thumb and track for Firefox */
}

/* WebKit Scrollbar Styling */
.notification-panel::-webkit-scrollbar {
  width: 8px;
}
.notification-panel::-webkit-scrollbar-thumb:hover {
  background-color: #2e3e2c;
}
.notification-panel::-webkit-scrollbar-track {
  background: transparent; /* Transparent track */
}

.notification-panel::-webkit-scrollbar-thumb {
  background-color: #435739; /* Thumb color */
  border-radius: 10px;
  border: 2px solid transparent; /* Keeps spacing */
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
  display: grid;
  grid-template-rows: 1fr;
  margin-top: 25px;
  color: black;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mark-all-read-btn {
  background: #435739;
  margin-top: 10px;
  color: white;
  border: none;
  width: 125px;
  height: 33px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.mark-all-read-btn:hover {
  background: #f2f4ec;
  color: #435739;
  border: 2px solid #435739;
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.notification-item.unread {
  background: rgba(67, 87, 57, 0.1);
  border-left: 4px solid #435739;
}

.notification-item:hover {
  background-color: #859972;
  color: #daf1de;
}

.notification-item:hover .time {
  color: #daf1de;
}

.notification-content {
  flex: 1;
}

.notification-type-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
  margin-bottom: 5px;
  text-transform: uppercase;
}

.notification-type-badge.new_event {
  background: #e8f5e9;
  color: #2e7d32;
}

.notification-type-badge.event_started {
  background: #e8f5e9;
  color: #2e7d32;
}

.notification-type-badge.event_ended {
  background: #f3e8e7;
  color: #e74c3c;
}

.notification-type-badge.volunteer_time_in {
  background: #e8f5e9;
  color: #2e7d32;
}

.notification-type-badge.volunteer_time_out {
  background: #e8f5e9;
  color: #2e7d32;
}

.notification-message {
  margin: 5px 0;
  font-size: 14px;
  line-height: 1.4;
}

.notification-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.delete-btn {
  font-size: 16px;
  color: #666;
  cursor: pointer;
  transition: color 0.3s ease;
}

.delete-btn:hover {
  color: #e74c3c;
}

.loading-state,
.no-notifications {
  padding: 20px;
  text-align: center;
  color: #666;
  font-style: italic;
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
