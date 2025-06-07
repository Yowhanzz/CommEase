import api from "./axios";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import QRCode from "qrcode";

// Extend dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone to Asia/Manila
dayjs.tz.setDefault("Asia/Manila");

export const authService = {
  async ensureCsrfToken() {
    try {
      const response = await axios.get(
        "http://localhost:8000/sanctum/csrf-cookie",
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get CSRF token:", error);
      throw error;
    }
  },

  async register(userData) {
    try {
      await this.ensureCsrfToken();
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  async verifyOtp(email, otp) {
    try {
      await this.ensureCsrfToken();
      const response = await api.post("/auth/verify-otp", { email, otp });
      return response.data;
    } catch (error) {
      console.error("OTP verification failed:", error);
      throw error;
    }
  },

  async createPassword(email, password, confirmPassword) {
    try {
      await this.ensureCsrfToken();
      const response = await api.post("/auth/create-password", {
        email,
        password,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Password creation failed:", error);
      throw error;
    }
  },

  async login(email, password) {
    try {
      await this.ensureCsrfToken();
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  async logout() {
    try {
      await this.ensureCsrfToken();
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  },

  async getUser() {
    try {
      const response = await api.get("/user/profile");
      return response.data;
    } catch (error) {
      console.error("Failed to get user:", error);
      throw error;
    }
  },
};

export const eventService = {
  async createEvent(eventData) {
    try {
      await authService.ensureCsrfToken();
      const response = await api.post("/events", eventData);
      return response;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error(
          "You do not have access to this event. Only volunteers from the specified programs can view this event."
        );
      }
      console.error("Event creation failed:", error);
      throw error;
    }
  },

  async getEventsOrganizer() {
    try {
      const response = await api.get("/events", {
        params: {
          include: "organizer",
        },
      });
      // Handle both possible response structures
      const eventsData = response.data.data || response.data;
      return {
        ...response,
        data: Array.isArray(eventsData) ? eventsData : [],
      };
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error(
          "You do not have access to these events. Only volunteers from the specified programs can view these events."
        );
      }
      console.error("Failed to fetch events:", error);
      throw error;
    }
  },

  async getEventsVolunteer() {
    try {
      const response = await api.get("/events", {
        params: {
          include: "volunteer",
          is_registered: true,
        },
      });
      // Handle both possible response structures
      const eventsData = response.data.data || response.data;
      return {
        ...response,
        data: Array.isArray(eventsData) ? eventsData : [],
      };
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error(
          "You do not have access to these events. Only volunteers from the specified programs can view these events."
        );
      }
      console.error("Failed to fetch events:", error);
      throw error;
    }
  },

  async getEventHistory() {
    try {
      const response = await api.get("event-history");
      return response;
    } catch (error) {
      console.error("Failed to fetch event history:", error);
      throw error;
    }
  },

  async getEvent(eventId) {
    try {
      console.log("Fetching event with ID:", eventId);
      const response = await api.get(`/events/${eventId}`, {
        params: {
          include: "organizer,volunteers",
        },
      });
      console.log("Event API response:", response);
      return response.data;
    } catch (error) {
      console.error("Get event error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      if (error.response?.status === 403) {
        throw new Error(
          "You do not have access to this event. Only volunteers from the specified programs can view this event."
        );
      }
      console.error("Failed to get event:", error);
      throw error;
    }
  },

  async register(eventId) {
    try {
      await authService.ensureCsrfToken();
      const response = await api.post(`/events/${eventId}/register`);
      return response;
    } catch (error) {
      console.error("Failed to register for event:", error);
      throw error;
    }
  },

  async submitThingsBrought(eventId, data) {
    try {
      await authService.ensureCsrfToken();
      const response = await api.post(
        `/events/${eventId}/things-brought`,
        data
      );
      return response;
    } catch (error) {
      console.error("Failed to submit things brought:", error);
      throw error;
    }
  },

  async submitSuggestion(eventId, data) {
    try {
      await authService.ensureCsrfToken();
      const response = await api.post(`/events/${eventId}/suggestions`, data);
      return response;
    } catch (error) {
      console.error("Failed to submit suggestion:", error);
      throw error;
    }
  },

  async updateEvent(eventId, eventData) {
    try {
      await authService.ensureCsrfToken();
      console.log(
        "Updating event with data:",
        JSON.stringify(eventData, null, 2)
      );
      const response = await api.put(`/events/${eventId}`, eventData);
      console.log("Update response:", response);
      return response;
    } catch (error) {
      console.error("Update event error details:", {
        status: error.response?.status,
        data: error.response?.data,
        validationErrors: error.response?.data?.errors,
        requestData: eventData,
      });

      if (error.response?.status === 403) {
        throw new Error(
          "You do not have access to this event. Only volunteers from the specified programs can view this event."
        );
      }

      if (error.response?.status === 422) {
        console.error("Backend Validation Error Data:", error.response.data);
        const validationErrors = error.response.data.errors || {};
        const errorMessage = Object.entries(validationErrors)
          .map(
            ([field, messages]) =>
              `${field}: ${
                Array.isArray(messages) ? messages.join(", ") : messages
              }`
          )
          .join("\n");
        throw new Error(errorMessage || "Validation failed");
      }

      throw error;
    }
  },

  async deleteEvent(eventId) {
    try {
      await authService.ensureCsrfToken();
      const response = await api.delete(`/events/${eventId}`);
      return response;
    } catch (error) {
      console.error("Delete event failed:", error);
      throw error;
    }
  },

  async startEvent(eventId) {
    try {
      await authService.ensureCsrfToken();
      const response = await api.post(`/events/${eventId}/start`);
      return response;
    } catch (error) {
      console.error("Start event failed:", error);
      throw error;
    }
  },

  async endEvent(eventId) {
    try {
      await authService.ensureCsrfToken();
      const response = await api.post(`/events/${eventId}/end`);
      return response;
    } catch (error) {
      console.error("End event failed:", error);
      throw error;
    }
  },

  async unregister(eventId) {
    try {
      await authService.ensureCsrfToken();
      const response = await api.post(`/events/${eventId}/unregister`);
      return response;
    } catch (error) {
      console.error("Failed to unregister from event:", error);
      throw error;
    }
  },

  async getArchivedEvents(params = {}) {
    try {
      // Simple request for archived events - no extra parameters needed
      // Backend already filters for completed events and organizer-specific events
      const response = await api.get("/events/archived");

      // Handle both possible response structures
      const eventsData = response.data.data || response.data;
      return {
        ...response,
        data: Array.isArray(eventsData) ? eventsData : [],
      };
    } catch (error) {
      console.error("Failed to fetch archived events:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      throw error;
    }
  },

  async getAllEvents() {
    try {
      // Fetch all events without role-specific filtering for calendar display
      const response = await api.get("/events", {
        params: {
          include: "organizer,volunteers",
          all: "true", // Request all events regardless of user role (must be string)
        },
      });

      console.log("getAllEvents API call made with params:", {
        include: "organizer,volunteers",
        all: "true"
      });

      // Handle both possible response structures
      const eventsData = response.data.data || response.data;
      return {
        ...response,
        data: Array.isArray(eventsData) ? eventsData : [],
      };
    } catch (error) {
      console.error("Failed to fetch all events:", error);
      throw error;
    }
  },
};

// Notification Services
export const notificationService = {
  // Get all notifications for the current user
  async getNotifications() {
    try {
      console.log("Making API call to /notifications");
      const response = await api.get("/notifications");
      console.log("Notification API response:", response);
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      console.error("Error message:", error.message);
      throw error;
    }
  },

  // Mark a specific notification as read
  async markAsRead(notificationId) {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const response = await api.put("/notifications/mark-all-read");
      return response.data;
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      throw error;
    }
  },

  // Get unread notification count
  async getUnreadCount() {
    try {
      const response = await api.get("/notifications/unread-count");
      return response.data.unread_count;
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
      throw error;
    }
  },

  // Delete a notification
  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete notification:", error);
      throw error;
    }
  },
};

// QR Code and Attendance Services
export const qrService = {
  // Generate QR code for a volunteer
  async generateQR(eventId, userEmailId) {
    try {
      // Generate QR code on frontend
      const qrData = userEmailId;
      const qrCode = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: "H",
        margin: 1,
        width: 300,
      });

      return {
        qr_code: qrCode,
        user: {
          user_email_id: userEmailId,
        },
      };
    } catch (error) {
      console.error("QR generation failed:", error);
      throw new Error("Failed to generate QR code");
    }
  },

  // Get QR status for a volunteer
  async getQRStatus(eventId, userEmailId) {
    try {
      const response = await api.get(`/events/${eventId}/qr-status`, {
        params: {
          user_email_id: userEmailId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to get QR status:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get QR status"
      );
    }
  },

  // Scan QR code for attendance
  async scanQR(eventId, userEmailId, scanType = "time_in") {
    try {
      if (!eventId) {
        throw new Error("Event ID is required");
      }
      if (!userEmailId) {
        throw new Error("User ID is required");
      }

      const response = await api.post(`/events/${eventId}/scan-qr`, {
        user_email_id: userEmailId,
        scan_type: scanType,
      });
      return response.data;
    } catch (error) {
      console.error("QR scan failed:", error);
      if (error.response?.status === 404) {
        throw new Error("User not found");
      } else if (error.response?.status === 403) {
        throw new Error("User is not registered for this event");
      } else if (error.response?.status === 422) {
        throw new Error(
          error.response.data.message ||
            "Cannot record attendance for this event"
        );
      }
      throw new Error(
        error.response?.data?.message || "Failed to process QR code"
      );
    }
  },

  // Get attendance status for a user
  async getAttendanceStatus(eventId, userEmailId) {
    try {
      const response = await api.get(`/events/${eventId}/attendance-status`, {
        params: {
          user_email_id: userEmailId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to get attendance status:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get attendance status"
      );
    }
  },

  // Generate QR code data for a user
  generateQRData(userEmailId) {
    return {
      user_email_id: userEmailId,
      timestamp: new Date().toISOString(),
    };
  },

  // Fetch permanent user QR code
  async getUserQR() {
    try {
      const response = await api.get("/user");
      const userEmailId = response.data.user_email_id;

      // Generate QR code on frontend
      const qrData = userEmailId;
      const qrCode = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: "H",
        margin: 1,
        width: 300,
      });

      return {
        qr_code: qrCode,
        user_email_id: userEmailId,
        email: response.data.email,
        name: `${response.data.first_name} ${response.data.last_name}`,
      };
    } catch (error) {
      console.error("Failed to fetch user QR code:", error);
      throw error;
    }
  },
};

// Global time/date formatting helpers
export const formatTime = (time) => {
  if (!time) return "";
  // Parse the time string directly without timezone conversion
  return dayjs(time, "HH:mm:ss").format("hh:mm A");
};

export const formatDate = (
  date,
  inputFormat = undefined,
  outputFormat = "MMMM D, YYYY"
) => {
  if (!date) return "";
  return inputFormat
    ? dayjs(date, inputFormat).format(outputFormat)
    : dayjs(date).format(outputFormat);
};

// Calendar-specific formatting functions
export const formatCalendarDateTime = (date, time) => {
  if (!date || !time) return "";

  try {
    // Handle different time formats from backend
    let timeString = time;

    // If time is already a full datetime string, extract just the time part
    if (time.includes('T') || time.includes(' ')) {
      timeString = dayjs(time).format('HH:mm:ss');
    }

    // Combine date and time for calendar display
    const dateTimeString = `${date} ${timeString}`;
    return dayjs(dateTimeString).tz("Asia/Manila").format();
  } catch (error) {
    console.error("Error formatting calendar datetime:", error, { date, time });
    return "";
  }
};

export const formatEventForCalendar = (event) => {
  if (!event) return null;

  try {
    // Create start and end datetime strings
    const startDateTime = formatCalendarDateTime(event.date, event.start_time);
    const endDateTime = formatCalendarDateTime(event.date, event.end_time);

    // Skip events with invalid dates
    if (!startDateTime || !endDateTime) {
      console.warn("Skipping event with invalid dates:", event);
      return null;
    }

    return {
      start: startDateTime,
      end: endDateTime,
      title: event.event_title || "Untitled Event",
      content: `
        <div class="calendar-event-content">
          <strong>${event.event_title}</strong><br>
          <small>📍 Barangay ${event.barangay}</small><br>
          <small>👥 ${(event.programs || []).join(", ")}</small><br>
          <small>📊 ${event.status || "Unknown"}</small>
        </div>
      `,
      class: `event-status-${(event.status || "unknown").toLowerCase()}`,
      deletable: false,
      resizable: false,
    };
  } catch (error) {
    console.error("Error formatting event for calendar:", error, event);
    return null;
  }
};
