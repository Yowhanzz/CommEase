<template>
  <div class="pie-chart-container">
    <canvas ref="pieChartRef" class="pie-chart"></canvas>
    <!-- Labels section below the pie chart -->
    <div class="labels-container">
      <div class="label-item">
        <span class="label-color" style="background-color: #DAF1DE;"></span> Attended
      </div>
      <div class="label-item">
        <span class="label-color" style="background-color: #235347;"></span> Did Not Attend
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

const pieChartRef = ref(null);

onMounted(() => {
  new Chart(pieChartRef.value, {
    type: 'pie',
    data: {
      datasets: [{
        data: [50, 10],
        backgroundColor: ['#235347', '#DAF1DE']
      }]
    },
    options: {
      responsive: false, // Disable responsive to keep fixed size
    }
  });
});
</script>

<style scoped>
.pie-chart-container {
  display: flex;
  flex-direction: column;  /* Align content vertically */
  justify-content: center;  /* Center content */
  align-items: center;      /* Center content */
  width: 100%;
}

.pie-chart {
  width: 200px;             /* Fixed size for the pie chart */
  height: 200px;
}

.labels-container {
  display: flex;
  justify-content: space-around;  /* Space between labels */
  align-items: center;            /* Center labels vertically */
  width: 100%;
  margin-top: 20px;               /* Space between chart and labels */
}

.label-item {
  display: flex;
  align-items: center;
  margin-top: 5%;
  color: #DAF1DE; /* ← ito ang nadagdag */
}


.label-color {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border-radius: 50%;
}
</style>
