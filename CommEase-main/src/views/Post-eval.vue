<template>
  <div>
    <!-- Trigger Button -->
    <button @click="showModal = true" class="button-post-event">
      📋 Post-eval
    </button>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>📝 Event Evaluation</h2>

        <form @submit.prevent="submitEvaluation">
          <!-- Questions with Star Ratings -->
          <div
            v-for="(question, index) in questions"
            :key="index"
            class="form-group"
          >
            <label class="question">{{ question }}</label>
            <div class="star-rating">
              <span
                v-for="star in 5"
                :key="star"
                class="star"
                :class="{ filled: star <= ratings[index] }"
                @click="ratings[index] = star"
                >★</span
              >
            </div>
          </div>

          <!-- File Upload -->
          <div class="form-group">
            <label class="question">📄 Upload Reflection Paper</label>
            <div class="file-upload-wrapper">
              <input
                type="file"
                id="file-upload"
                class="file-input"
                @change="handleFileUpload"
                accept=".pdf,.doc,.docx"
                required
              />
              <label for="file-upload" class="upload-label">
                <span>📎 Choose File</span>
              </label>
              <p v-if="reflectionFileName" class="file-name">
                📁 {{ reflectionFileName }}
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="form-actions">
            <button type="button" @click="showModal = false" class="cancel-btn">
              Cancel
            </button>
            <button type="submit" class="submit-btn">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const showModal = ref(false);
const questions = [
  "The activity was well-organized and clearly explained.",
  "I was able to contribute meaningfully to the community.",
  "The facilitators were helpful and approachable.",
  "I gained valuable insights or learning from the experience.",
];
const ratings = ref(Array(questions.length).fill(0));

const reflectionFile = ref(null);
const reflectionFileName = ref("");

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    reflectionFile.value = file;
    reflectionFileName.value = file.name;
  }
};

const submitEvaluation = () => {
  console.log("Ratings:", ratings.value);
  console.log("Reflection File:", reflectionFile.value);

  // Reset modal
  showModal.value = false;
  reflectionFile.value = null;
  reflectionFileName.value = "";
};
</script>

<style scoped>
/* Post-eval Button */
.button-post-event {
  background: linear-gradient(to right, #6a82fb, #56ccf2);
  color: white;
  padding: 14px 28px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(106, 130, 251, 0.3);
  transition: 0.3s;
}
.button-post-event:hover {
  opacity: 0.9;
}

/* Modal Design */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: grid;
  place-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  width: 90%;
  max-width: 580px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease-in-out;
}

h2 {
  margin-bottom: 24px;
  font-size: 24px;
  text-align: center;
  color: #333;
}

/* Question Block */
.form-group {
  margin-bottom: 28px;
}
.question {
  font-weight: 600;
  display: block;
  margin-bottom: 12px;
  color: #444;
}

/* 🌟 Star Rating */
.star-rating {
  display: flex;
  gap: 8px;
  font-size: 28px;
  cursor: pointer;
}
.star {
  color: #ccc;
  transition: color 0.2s;
}
.star.filled {
  color: #ffc107;
}

/* 📂 File Upload */
.file-upload-wrapper {
  position: relative;
}

.file-input {
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 40px;
  top: 0;
  left: 0;
  cursor: pointer;
}

.upload-label {
  background: #f1f1f1;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 500;
  display: inline-block;
  cursor: pointer;
  transition: background 0.3s;
}
.upload-label:hover {
  background: #e0e0e0;
}

.file-name {
  margin-top: 10px;
  font-size: 14px;
  color: #555;
  font-style: italic;
}

/* Buttons */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
}
.cancel-btn,
.submit-btn {
  padding: 10px 22px;
  font-size: 15px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}
.cancel-btn {
  background-color: #e0e0e0;
  color: #333;
}
.cancel-btn:hover {
  background-color: #c8c8c8;
}
.submit-btn {
  background-color: #4caf50;
  color: white;
}
.submit-btn:hover {
  background-color: #3e8e41;
}

/* Animation */
@keyframes fadeIn {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
