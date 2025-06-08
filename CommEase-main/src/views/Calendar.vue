<template>
  <div class="calendar-page">
    <!-- Header -->
    <div class="page-header">
      <h1>Event Calendar</h1>
      <p>View all events across the system</p>
    </div>

    <!-- Calendar Component -->
    <div class="calendar-container">
      <CustomCalendar />
    </div>

    <!-- Legend -->
    <div class="calendar-legend">
      <h3>Event Status Legend</h3>
      <div class="legend-items">
        <div class="legend-item">
          <span class="legend-dot status-pending"></span>
          <span>Pending</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot status-upcoming"></span>
          <span>Upcoming</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot status-ongoing"></span>
          <span>Ongoing</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot status-completed"></span>
          <span>Completed</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot status-cancelled"></span>
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomCalendar from '@/components/CustomCalendar.vue';

export default {
  name: 'Calendar',
  components: {
    CustomCalendar
  }
};
</script>

<style scoped>
.calendar-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f8f9fa;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 700;
}

.page-header p {
  margin: 0;
  color: #666;
  font-size: 1.1rem;
}

.calendar-container {
  margin-bottom: 30px;
}

.calendar-legend {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.calendar-legend h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  display: inline-block;
}

.legend-dot.status-pending {
  background: #fbbf24;
}

.legend-dot.status-upcoming {
  background: #60a5fa;
}

.legend-dot.status-ongoing {
  background: #34d399;
}

.legend-dot.status-completed {
  background: #9ca3af;
}

.legend-dot.status-cancelled {
  background: #f87171;
}

.legend-item span:last-child {
  font-weight: 500;
  color: #495057;
}

/* Responsive Design */
@media (max-width: 768px) {
  .calendar-page {
    padding: 10px;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .legend-items {
    justify-content: center;
  }
}
</style>
