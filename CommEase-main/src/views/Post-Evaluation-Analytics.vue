<template>
  <div class="post-eval-container">
    <!-- Header -->
    <div class="header-section">
      <h1>📊 Post-Event Evaluation Analytics</h1>
      <p class="subtitle">View and analyze volunteer feedback for your events</p>
    </div>

    <!-- Event Selection -->
    <div class="event-selection">
      <label for="event-select">Select Event:</label>
      <select 
        id="event-select" 
        v-model="selectedEventId" 
        @change="fetchEvaluations"
        class="event-dropdown"
      >
        <option value="">Choose an event...</option>
        <option 
          v-for="event in completedEvents" 
          :key="event.id" 
          :value="event.id"
        >
          {{ event.event_title }} - {{ formatDate(event.date) }}
        </option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <p>Loading evaluations...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchEvaluations" class="retry-btn">Retry</button>
    </div>

    <!-- No Event Selected -->
    <div v-if="!selectedEventId && !loading" class="no-selection">
      <p>Please select an event to view its evaluations.</p>
    </div>

    <!-- No Evaluations -->
    <div v-if="selectedEventId && evaluations.length === 0 && !loading && !error" class="no-evaluations">
      <p>No evaluations have been submitted for this event yet.</p>
    </div>

    <!-- Evaluations Content -->
    <div v-if="evaluations.length > 0" class="evaluations-content">
      <!-- Statistics Overview -->
      <div class="stats-section">
        <h2>📈 Overview Statistics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>{{ stats.total_evaluations }}</h3>
            <p>Total Evaluations</p>
          </div>
          <div class="stat-card">
            <h3>{{ stats.average_rating.toFixed(1) }}/5</h3>
            <p>Average Rating</p>
          </div>
          <div class="stat-card">
            <h3>{{ stats.response_rate.toFixed(1) }}%</h3>
            <p>Response Rate</p>
          </div>
        </div>
      </div>

      <!-- Rating Breakdown -->
      <div class="rating-breakdown">
        <h2>⭐ Rating Breakdown</h2>
        <div class="questions-ratings">
          <div 
            v-for="(question, key) in questions" 
            :key="key"
            class="question-rating"
          >
            <h4>{{ question }}</h4>
            <div class="rating-bar">
              <span class="rating-value">{{ getAverageForQuestion(key).toFixed(1) }}/5</span>
              <div class="bar">
                <div 
                  class="fill" 
                  :style="{ width: (getAverageForQuestion(key) / 5) * 100 + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Individual Evaluations -->
      <div class="evaluations-list">
        <h2>📝 Individual Evaluations</h2>
        <div class="evaluation-cards">
          <div 
            v-for="evaluation in evaluations" 
            :key="evaluation.id"
            class="evaluation-card"
          >
            <div class="evaluation-header">
              <h3>{{ evaluation.volunteer.first_name }} {{ evaluation.volunteer.last_name }}</h3>
              <span class="overall-rating">
                {{ evaluation.average_rating }}/5 ⭐
              </span>
            </div>
            
            <div class="ratings-detail">
              <div class="rating-item">
                <span>Quality:</span>
                <span>{{ evaluation.quality_rating }}/5</span>
              </div>
              <div class="rating-item">
                <span>Responsiveness:</span>
                <span>{{ evaluation.responsiveness_rating }}/5</span>
              </div>
              <div class="rating-item">
                <span>Effectiveness:</span>
                <span>{{ evaluation.effectiveness_rating }}/5</span>
              </div>
              <div class="rating-item">
                <span>Organization:</span>
                <span>{{ evaluation.organization_rating }}/5</span>
              </div>
              <div class="rating-item">
                <span>Recommendation:</span>
                <span>{{ evaluation.recommendation_rating }}/5</span>
              </div>
            </div>

            <div v-if="evaluation.reflection_text" class="reflection-text">
              <h5>Reflection:</h5>
              <div class="reflection-content">
                {{ evaluation.reflection_text }}
              </div>
              <div class="reflection-word-count">
                {{ getWordCount(evaluation.reflection_text) }} words
              </div>
            </div>

            <div class="evaluation-date">
              Submitted: {{ formatDateTime(evaluation.created_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { eventService, formatDate } from '@/api/services';

// State
const selectedEventId = ref('');
const completedEvents = ref([]);
const evaluations = ref([]);
const stats = ref(null);
const questions = ref({});
const loading = ref(false);
const error = ref(null);

// Fetch completed events on mount
const fetchCompletedEvents = async () => {
  try {
    const response = await eventService.getEventsOrganizer();
    const allEvents = response.data.data || response.data;
    completedEvents.value = allEvents.filter(event => 
      event.status && event.status.toLowerCase() === 'completed'
    );
    console.log('📅 Completed events loaded:', completedEvents.value.length);
  } catch (err) {
    console.error('❌ Failed to fetch completed events:', err);
    error.value = 'Failed to load events';
  }
};

// Fetch evaluations for selected event
const fetchEvaluations = async () => {
  if (!selectedEventId.value) {
    evaluations.value = [];
    stats.value = null;
    questions.value = {};
    return;
  }

  try {
    loading.value = true;
    error.value = null;
    
    console.log('📊 Fetching evaluations for event:', selectedEventId.value);
    const response = await eventService.getPostEvaluations(selectedEventId.value);
    
    evaluations.value = response.data.evaluations || [];
    stats.value = response.data.stats;
    questions.value = response.data.questions || {};
    
    console.log('✅ Evaluations loaded:', evaluations.value.length);
    console.log('📈 Stats:', stats.value);
  } catch (err) {
    console.error('❌ Failed to fetch evaluations:', err);
    error.value = err.response?.data?.message || 'Failed to load evaluations';
  } finally {
    loading.value = false;
  }
};

// Get average rating for a specific question
const getAverageForQuestion = (questionKey) => {
  if (!stats.value || !stats.value.average_ratings) return 0;
  return stats.value.average_ratings[questionKey] || 0;
};

// Format date and time
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

// Count words in reflection text
const getWordCount = (text) => {
  if (!text || text.trim() === "") return 0;
  return text.trim().split(/\s+/).length;
};

onMounted(() => {
  fetchCompletedEvents();
});
</script>

<style scoped>
.post-eval-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
}

.header-section h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 16px;
}

.event-selection {
  margin-bottom: 30px;
}

.event-dropdown {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.loading-state, .error-state, .no-selection, .no-evaluations {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error-state {
  color: #c33;
}

.retry-btn {
  background: #81a263;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.stats-section {
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e9ecef;
}

.stat-card h3 {
  font-size: 2em;
  color: #81a263;
  margin: 0 0 10px 0;
}

.rating-breakdown {
  margin-bottom: 30px;
}

.question-rating {
  margin-bottom: 20px;
}

.question-rating h4 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 15px;
}

.rating-value {
  font-weight: bold;
  min-width: 50px;
}

.bar {
  flex: 1;
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: linear-gradient(90deg, #81a263, #a4c471);
  transition: width 0.3s ease;
}

.evaluation-cards {
  display: grid;
  gap: 20px;
}

.evaluation-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.evaluation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.evaluation-header h3 {
  margin: 0;
  color: #2c3e50;
}

.overall-rating {
  background: #81a263;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-weight: bold;
}

.ratings-detail {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 15px;
}

.rating-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #f0f0f0;
}

.reflection-text {
  margin-bottom: 15px;
}

.reflection-text h5 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 600;
}

.reflection-content {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid #81a263;
  font-size: 14px;
  line-height: 1.5;
  color: #2c3e50;
  margin-bottom: 5px;
  max-height: 120px;
  overflow-y: auto;
}

.reflection-word-count {
  text-align: right;
  font-size: 12px;
  color: #666;
  font-style: italic;
}

.evaluation-date {
  color: #666;
  font-size: 14px;
  font-style: italic;
}
</style>
