<template>
  <div>
    <!-- Registration Form -->
    <form @submit.prevent="register">
      <input v-model="form.title" placeholder="Event title" required />
      <input type="datetime-local" v-model="form.start" required />
      <input type="datetime-local" v-model="form.end" required />
      <button type="submit">Register</button>
    </form>

    <!-- Calendar -->
    <vue-cal
      style="height: 600px"
      :events="calendarEvents"
      default-view="week"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";

// Reactive form data
const form = ref({
  title: "",
  start: "",
  end: "",
});

// Calendar events
const calendarEvents = ref([]);

// Register and mark event
const register = () => {
  // Push new event to calendar
  calendarEvents.value.push({
    title: form.value.title,
    start: new Date(form.value.start),
    end: new Date(form.value.end),
    content: "You registered!",
    class: "vuecal__event--blue", // Optional for color styling
  });

  // Clear form
  form.value = { title: "", start: "", end: "" };
};
</script>
