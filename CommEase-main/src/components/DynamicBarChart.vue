<template>
  <div class="bar-chart-container">
    <canvas ref="barChartRef"></canvas>
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
  xAxisLabel: {
    type: String,
    default: "",
  },
  yAxisLabel: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "#435739",
  },
});

const barChartRef = ref(null);
let chartInstance = null;

const createChart = () => {
  if (!barChartRef.value || !props.chartData.length) return;

  // Destroy existing chart if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  const labels = props.chartData.map((item) => item.label);
  const data = props.chartData.map((item) => item.value);

  chartInstance = new Chart(barChartRef.value, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: props.yAxisLabel || "Value",
          data: data,
          backgroundColor: props.color,
          borderColor: props.color,
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
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
      scales: {
        x: {
          title: {
            display: !!props.xAxisLabel,
            text: props.xAxisLabel,
            color: "#2c3e50",
            font: {
              weight: "bold",
            },
          },
          ticks: {
            color: "#2c3e50",
            maxRotation: 45,
            minRotation: 0,
          },
          grid: {
            display: false,
          },
        },
        y: {
          title: {
            display: !!props.yAxisLabel,
            text: props.yAxisLabel,
            color: "#2c3e50",
            font: {
              weight: "bold",
            },
          },
          ticks: {
            color: "#2c3e50",
            beginAtZero: true,
          },
          grid: {
            color: "rgba(0,0,0,0.1)",
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
.bar-chart-container {
  width: 100%;
  max-width: 600px;
  height: 300px;
  margin: 0 auto;
  padding: 10px;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}

@media (max-width: 768px) {
  .bar-chart-container {
    height: 250px;
  }
}
</style>
