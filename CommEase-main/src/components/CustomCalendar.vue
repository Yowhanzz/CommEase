<template>
  <div class="custom-calendar">
    <!-- Calendar Header -->
    <div class="calendar-header">
      <button @click="previousMonth" class="nav-btn">
        <i class="bx bx-chevron-left"></i>
      </button>
      <h2 class="month-year">{{ currentMonthYear }}</h2>
      <button @click="nextMonth" class="nav-btn">
        <i class="bx bx-chevron-right"></i>
      </button>
    </div>

    <!-- Days of Week Header -->
    <div class="days-header">
      <div v-for="day in daysOfWeek" :key="day" class="day-header">
        {{ day }}
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="calendar-grid">
      <div
        v-for="date in calendarDates"
        :key="date.key"
        :class="[
          'calendar-date',
          {
            'other-month': !date.isCurrentMonth,
            today: date.isToday,
            'has-events': date.events.length > 0,
          },
        ]"
        @click="selectDate(date)"
      >
        <div class="date-number">{{ date.day }}</div>
        <div class="events-container">
          <div
            v-for="event in date.events.slice(0, 3)"
            :key="event.id"
            :class="['event-dot', `status-${event.status}`]"
            :title="event.event_title"
          >
            <span class="event-title">{{ event.event_title }}</span>
          </div>
          <div v-if="date.events.length > 3" class="more-events">
            +{{ date.events.length - 3 }} more
          </div>
        </div>
      </div>
    </div>

    <!-- Event Details Modal -->
    <div
      v-if="selectedDate && selectedDate.events.length > 0"
      class="event-modal-overlay"
      @click="closeModal"
    >
      <div class="event-modal" @click.stop>
        <div class="modal-header">
          <h3>Events on {{ formatSelectedDate }}</h3>
          <button @click="closeModal" class="close-btn">
            <i class="bx bx-x"></i>
          </button>
        </div>
        <div class="modal-content">
          <div
            v-for="event in selectedDate.events"
            :key="event.id"
            :class="['event-card', `status-${event.status}`]"
          >
            <div class="event-header">
              <h4>{{ event.event_title }}</h4>
              <span :class="['status-badge', `status-${event.status}`]">
                {{ event.status }}
              </span>
            </div>
            <div class="event-details">
              <p>
                <i class="bx bx-time"></i> {{ formatTime(event.start_time) }} -
                {{ formatTime(event.end_time) }}
              </p>
              <p><i class="bx bx-map"></i> Barangay {{ event.barangay }}</p>
              <p>
                <i class="bx bx-group"></i>
                {{ (event.programs || []).join(", ") }}
              </p>
              <p>
                <i class="bx bx-user"></i> {{ event.organizer?.first_name }}
                {{ event.organizer?.last_name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Loading events...</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { eventService } from "@/api/services";

export default {
  name: "CustomCalendar",
  setup() {
    const currentDate = ref(new Date());
    const events = ref([]);
    const loading = ref(false);
    const selectedDate = ref(null);

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Computed properties
    const currentMonthYear = computed(() => {
      return currentDate.value.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    });

    const formatSelectedDate = computed(() => {
      if (!selectedDate.value) return "";
      return selectedDate.value.date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    });

    const calendarDates = computed(() => {
      const year = currentDate.value.getFullYear();
      const month = currentDate.value.getMonth();

      // Get first day of month and how many days in month
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      // Get days from previous month to fill the grid
      const daysFromPrevMonth = startingDayOfWeek;
      const prevMonth = new Date(year, month - 1, 0);
      const daysInPrevMonth = prevMonth.getDate();

      const dates = [];

      // Previous month days
      for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const date = new Date(year, month - 1, day);
        dates.push(createDateObject(date, false));
      }

      // Current month days
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        dates.push(createDateObject(date, true));
      }

      // Next month days to fill remaining slots
      const remainingSlots = 42 - dates.length; // 6 rows × 7 days
      for (let day = 1; day <= remainingSlots; day++) {
        const date = new Date(year, month + 1, day);
        dates.push(createDateObject(date, false));
      }

      return dates;
    });

    // Helper functions
    const createDateObject = (date, isCurrentMonth) => {
      const today = new Date();
      const dateString = date.toDateString();
      const dayEvents = events.value.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === dateString;
      });

      return {
        date,
        day: date.getDate(),
        isCurrentMonth,
        isToday: dateString === today.toDateString(),
        events: dayEvents,
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      };
    };

    const formatTime = (datetime) => {
      return new Date(datetime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // Navigation functions
    const previousMonth = () => {
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() - 1,
        1
      );
    };

    const nextMonth = () => {
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1,
        1
      );
    };

    const selectDate = (date) => {
      if (date.events.length > 0) {
        selectedDate.value = date;
      }
    };

    const closeModal = () => {
      selectedDate.value = null;
    };

    // Fetch events
    const fetchEvents = async () => {
      try {
        loading.value = true;
        const response = await eventService.getAllEvents();
        events.value = response.data || [];
        console.log("📅 Calendar events loaded:", events.value.length);
      } catch (error) {
        console.error("❌ Failed to fetch calendar events:", error);
        events.value = [];
      } finally {
        loading.value = false;
      }
    };

    // Lifecycle
    onMounted(() => {
      fetchEvents();
    });

    return {
      currentDate,
      events,
      loading,
      selectedDate,
      daysOfWeek,
      currentMonthYear,
      formatSelectedDate,
      calendarDates,
      formatTime,
      previousMonth,
      nextMonth,
      selectDate,
      closeModal,
      fetchEvents,
    };
  },
};
</script>

<style scoped>
.custom-calendar {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 1000px;
  margin: 0 auto;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #435739;
  color: white;
}

.month-year {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.nav-btn i {
  font-size: 1.2rem;
}

.days-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.day-header {
  padding: 15px;
  text-align: center;
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e9ecef;
}

.calendar-date {
  background: white;
  min-height: 120px;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
}

.calendar-date:hover {
  background: #f8f9fa;
}

.calendar-date.other-month {
  background: #f8f9fa;
  color: #adb5bd;
}

.calendar-date.today {
  background: #e3f2fd;
  border: 2px solid #2196f3;
}

.calendar-date.has-events {
  background: #f0f7ff;
}

.date-number {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 5px;
}

.events-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.event-dot {
  background: #435739;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.event-dot.status-pending {
  background: #fbbf24;
  color: #92400e;
}

.event-dot.status-upcoming {
  background: #60a5fa;
  color: #1e40af;
}

.event-dot.status-ongoing {
  background: #d9dfcc;
  color: #4e653d;
}

.event-dot.status-completed {
  background: #9ca3af;
  color: #374151;
}

.event-dot.status-cancelled {
  background: #f87171;
  color: #7f1d1d;
}

.more-events {
  font-size: 0.7rem;
  color: #666;
  font-style: italic;
  margin-top: 2px;
}

/* Modal Styles */
.event-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.event-modal {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #435739;
  color: white;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-content {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.event-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  border-left: 4px solid #435739;
}

.event-card.status-pending {
  border-left-color: #fbbf24;
}

.event-card.status-upcoming {
  border-left-color: #60a5fa;
}

.event-card.status-ongoing {
  border-left-color: #435739;
}

.event-card.status-completed {
  border-left-color: #9ca3af;
}

.event-card.status-cancelled {
  border-left-color: #e74c3c;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.event-header h4 {
  margin: 0;
  color: #2c3e50;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.status-upcoming {
  background: #dbeafe;
  color: #1e40af;
}

.status-badge.status-ongoing {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.status-completed {
  background: #f3f4f6;
  color: #374151;
}

.status-badge.status-cancelled {
  background: #fee2e2;
  color: #7f1d1d;
}

.event-details p {
  margin: 5px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.event-details i {
  width: 16px;
  color: #435739;
}

/* Loading Styles */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #435739;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .calendar-date {
    min-height: 80px;
    padding: 4px;
  }

  .date-number {
    font-size: 0.9rem;
  }

  .event-dot {
    font-size: 0.7rem;
    padding: 1px 4px;
  }

  .event-modal {
    width: 95%;
    margin: 10px;
  }

  .modal-header {
    padding: 15px;
  }

  .modal-content {
    padding: 15px;
  }
}
</style>
