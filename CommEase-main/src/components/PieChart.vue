<template>
  <div class="pie-chart-container">
    <canvas ref="pieChartRef" class="pie-chart"></canvas>
    <!-- Dynamic Labels section below the pie chart -->
    <div class="labels-container">
      <div
        v-for="(item, index) in chartData"
        :key="index"
        class="label-item"
      >
        <span
          class="label-color"
          :style="{ backgroundColor: item.color }"
        ></span>
        <span class="label-text">
          {{ item.label }}: {{ item.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import Chart from "chart.js/auto";

// Props for dynamic data
const props = defineProps({
  chartData: {
    type: Array,
    default: () => [
      { label: "Attended", value: 20, color: "#435739" },
      { label: "Did Not Attend", value: 40, color: "#6B7C61" }
    ]
  },
  title: {
    type: String,
    default: ""
  }
});

const pieChartRef = ref(null);
let chartInstance = null;

const createChart = () => {
  if (!pieChartRef.value || !props.chartData.length) return;

  // Destroy existing chart if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  const labels = props.chartData.map(item => item.label);
  const data = props.chartData.map(item => item.value);
  const colors = props.chartData.map(item => item.color);

  chartInstance = new Chart(pieChartRef.value, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          borderColor: '#fff',
          borderWidth: 3,
          hoverBorderWidth: 4,
          hoverBorderColor: '#fff'
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          display: false // We use custom labels below
        },
        title: {
          display: !!props.title,
          text: props.title,
          color: '#2c3e50',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(44, 62, 80, 0.9)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#2c3e50',
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${context.label}: ${context.parsed} (${percentage}%)`;
            }
          }
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1000,
        easing: 'easeInOutQuart'
      },
      elements: {
        arc: {
          borderWidth: 3
        }
      }
    },
  });
};

onMounted(() => {
  nextTick(() => {
    createChart();
  });
});

// Watch for data changes and recreate chart
watch(() => props.chartData, () => {
  nextTick(() => {
    createChart();
  });
}, { deep: true });
</script>

<style scoped>
.pie-chart-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8ecef;
  position: relative;
  overflow: hidden;
}

.pie-chart-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #435739, #81a263, #6b8a4f);
  border-radius: 16px 16px 0 0;
}

.pie-chart {
  width: 220px;
  height: 220px;
  margin-bottom: 10px;
}

.labels-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 12px;
  margin-top: 20px;
  padding: 0 10px;
}

.label-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 20px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.label-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.label-color {
  width: 16px;
  height: 16px;
  margin-right: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.label-text {
  color: #2c3e50;
  font-weight: 600;
  font-size: 14px;
  flex: 1;
}

/* Responsive design */
@media (max-width: 768px) {
  .pie-chart-container {
    padding: 15px;
  }

  .pie-chart {
    width: 180px;
    height: 180px;
  }

  .label-text {
    font-size: 13px;
  }

  .labels-container {
    gap: 8px;
  }

  .label-item {
    padding: 6px 10px;
  }
}

@media (max-width: 480px) {
  .pie-chart {
    width: 160px;
    height: 160px;
  }

  .label-text {
    font-size: 12px;
  }

  .label-color {
    width: 14px;
    height: 14px;
    margin-right: 8px;
  }
}
</style>
