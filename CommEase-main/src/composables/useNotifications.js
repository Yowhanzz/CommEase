import { ref } from 'vue';
import { notificationService } from '@/api/services';

export function useNotifications() {
  const notifications = ref([]);
  const notificationLoading = ref(false);
  const unreadCount = ref(0);
  const showNotifications = ref(false);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      notificationLoading.value = true;
      console.log("🔔 Fetching notifications...");
      const response = await notificationService.getNotifications();
      console.log("🔔 Notifications response:", response);
      notifications.value = response.notifications || [];
      unreadCount.value = response.unread_count || 0;
      console.log("🔔 Notifications loaded:", notifications.value.length, "notifications");
      console.log("🔔 Unread count:", unreadCount.value);
    } catch (error) {
      console.error("❌ Failed to fetch notifications:", error);
      console.error("❌ Error status:", error.response?.status);
      console.error("❌ Error data:", error.response?.data);
      notifications.value = [];
      unreadCount.value = 0;
    } finally {
      notificationLoading.value = false;
    }
  };

  // Toggle notification panel and fetch notifications when opening
  const toggleNotifications = async () => {
    showNotifications.value = !showNotifications.value;
    
    // Fetch notifications when opening the panel
    if (showNotifications.value) {
      console.log("🔔 Notification panel opened - fetching notifications");
      await fetchNotifications();
    }
  };

  // Mark a specific notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      // Update local state
      const notification = notifications.value.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      // Update local state
      notifications.value.forEach(notification => {
        notification.read = true;
      });
      unreadCount.value = 0;
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  // Delete a notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      // Remove from local state
      const index = notifications.value.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        const notification = notifications.value[index];
        if (!notification.read) {
          unreadCount.value = Math.max(0, unreadCount.value - 1);
        }
        notifications.value.splice(index, 1);
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  // Add a local notification (for immediate feedback after actions)
  const addLocalNotification = (message, type) => {
    try {
      // Add new notification to the list
      notifications.value.unshift({
        id: Date.now(), // Temporary ID for local notifications
        message,
        type,
        time: "Just now",
        read: false,
      });

      // Keep only the latest 10 notifications
      if (notifications.value.length > 10) {
        notifications.value = notifications.value.slice(0, 10);
      }
      
      // Update unread count
      unreadCount.value++;
    } catch (error) {
      console.error("Failed to add local notification:", error);
    }
  };

  return {
    // State
    notifications,
    notificationLoading,
    unreadCount,
    showNotifications,
    
    // Methods
    fetchNotifications,
    toggleNotifications,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDeleteNotification,
    addLocalNotification,
  };
}
