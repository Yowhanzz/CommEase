<template>
  <div class="bar-chart-container">
    <canvas ref="barChartRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

const barChartRef = ref(null);

onMounted(() => {
  new Chart(barChartRef.value, {
    type: "bar",
    data: {
      labels: [
        "Volunteer A",
        "Volunteer B",
        "Volunteer C",
        "Volunteer A",
        "Volunteer B",
        "Volunteer C",
        "Volunteer A",
        "Volunteer B",
        "Volunteer C",
      ],
      datasets: [
        {
          label: "Hours Volunteered",
          data: [2, 3.5, 1.75, 2, 3.5, 1.75, 2, 3.5, 1.75],
          backgroundColor: "#435739",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            color: "black", // X-axis label color
          },
        },
        y: {
          ticks: {
            color: "black", // Y-axis label color
          },
        },
      },
    },
  });
});
</script>

<style scoped>
.bar-chart-container {
  width: 100%;
  max-width: 600px;
  height: 300px;
  margin: 0 auto;
  margin-top: -8%;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
