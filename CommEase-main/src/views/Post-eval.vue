<template>
  <div class="analytics-container">
    <!-- Review Analytics -->
    <div class="review-list">
      <h3>📊 Review Analytics</h3>
      <div v-if="reviews.length === 0" class="no-data">No reviews yet.</div>
      <div v-for="(rev, index) in reviews" :key="index" class="review-card">
        <p>
          <strong>Avg Rating:</strong>
          <span class="rating-display">
            <span
              v-for="s in 5"
              :key="s"
              :class="s <= Math.round(rev.average) ? 'filled' : 'empty'"
              >★</span
            >
            ({{ rev.average.toFixed(1) }})
          </span>
        </p>
        <p class="reflection">{{ rev.reflection }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Questions
const questions = [
  "Was the event organized well?",
  "Were the activities engaging?",
  "Were the speakers effective?",
  "Was the event timely?",
  "Would you attend a future event?",
];

const questionRatings = ref(Array(5).fill(0));
const reflection = ref("");
const reviews = ref([]);

// Rating setter
function setQuestionRating(index, value) {
  questionRatings.value[index] = value;
}

// Submit handler
function submitReview() {
  const valid = questionRatings.value.every((r) => r > 0);

  if (!valid || !reflection.value.trim()) {
    alert("Please answer all questions and add a reflection.");
    return;
  }

  const total = questionRatings.value.reduce((a, b) => a + b, 0);
  const average = total / questionRatings.value.length;

  reviews.value.push({
    average,
    reflection: reflection.value.trim(),
  });

  // Reset
  questionRatings.value = Array(5).fill(0);
  reflection.value = "";
}
</script>
<style scoped>
.analytics-container {
  max-width: 900px;
  margin: 40px auto;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-family: "Segoe UI", sans-serif;
}

.review-form,
.review-list {
  background: #f2f4ec;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  min-width: 560px;
}

.review-form h2,
.review-list h3 {
  margin-bottom: 16px;
  color: #333;
}

.question-block {
  margin-bottom: 14px;
}

.question-block p {
  margin: 0 0 4px;
  font-weight: 500;
}

.stars {
  display: flex;
  gap: 5px;
  font-size: 24px;
  cursor: pointer;
}

.filled {
  color: gold;
}
.empty {
  color: lightgray;
}

textarea {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  resize: none;
  margin-top: 10px;
  margin-bottom: 12px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}
button:hover {
  background-color: #0056b3;
}

.review-list {
  max-height: 500px;
  margin-top: 30px;
  overflow-y: auto;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
}

/* Optional scroll styling */
.review-list::-webkit-scrollbar {
  width: 6px;
}

.review-list::-webkit-scrollbar-thumb {
  background-color: #bbb;
  border-radius: 10px;
}

.review-card {
  background-color: #f2f4ec;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);

  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  border-left: 4px solid #435739;
  word-wrap: break-word;
}

.rating-display {
  font-size: 18px;
  margin: 6px 0;
}

.reflection {
  font-size: 14px;
  color: #444;
  white-space: pre-wrap;
}

.no-data {
  color: #888;
  font-style: italic;
}
</style>
