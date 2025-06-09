<template>
  <div class="pie-chart-container">
    <canvas ref="pieChartRef" class="pie-chart"></canvas>
    <!-- Dynamic Labels section below the pie chart -->
    <div class="labels-container">
      <div v-for="(item, index) in chartData" :key="index" class="label-item">
        <span
          class="label-color"
          :style="{ backgroundColor: item.color }"
        ></span>
        {{ item.label }}: {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
  chartData: {
    type: Array,
    required: true,
    default: () => [],
  },
  title: {
    type: String,
    default: "",
  },
});

const pieChartRef = ref(null);
let chartInstance = null;

const createChart = () => {
  if (!pieChartRef.value || !props.chartData.length) return;

  // Destroy existing chart if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  const labels = props.chartData.map((item) => item.label);
  const data = props.chartData.map((item) => item.value);
  const colors = props.chartData.map((item) => item.color);

  chartInstance = new Chart(pieChartRef.value, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          display: false, // We'll use custom labels below
        },
        title: {
          display: !!props.title,
          text: props.title,
          color: "#2c3e50",
          font: {
            size: 16,
            weight: "bold",
          },
        },
      },
    },
  });
};

onMounted(() => {
  nextTick(() => {
    createChart();
  });
});

// Watch for data changes and recreate chart
watch(
  () => props.chartData,
  () => {
    nextTick(() => {
      createChart();
    });
  },
  { deep: true }
);
</script>

<style scoped>
.pie-chart-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.pie-chart {
  width: 200px;
  height: 200px;
}

.labels-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-top: 20px;
  gap: 8px;
}

.label-item {
  display: flex;
  align-items: center;
  color: #2c3e50;
  font-size: 14px;
  font-weight: 500;
}

.label-color {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .pie-chart {
    width: 150px;
    height: 150px;
  }

  .labels-container {
    align-items: center;
  }
}
</style>
