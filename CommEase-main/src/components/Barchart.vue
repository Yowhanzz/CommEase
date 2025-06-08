<template>
  <div class="bar-chart-container">
    <canvas ref="barChartRef"></canvas>
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
      { name: "Volunteer A", duration: 2 },
      { name: "Volunteer B", duration: 3.5 },
      { name: "Volunteer C", duration: 1.75 },
    ]
  },
  title: {
    type: String,
    default: "Hours Volunteered"
  }
});

const barChartRef = ref(null);
let chartInstance = null;

const createChart = () => {
  if (!barChartRef.value) return;

  // Destroy existing chart if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Prepare data from props
  const labels = props.chartData.map(item => {
    // Truncate long names for better display
    return item.name.length > 12 ? item.name.substring(0, 12) + '...' : item.name;
  });
  const data = props.chartData.map(item => item.duration);

  // Create gradient
  const ctx = barChartRef.value.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, '#81a263');
  gradient.addColorStop(1, '#435739');

  chartInstance = new Chart(barChartRef.value, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: props.title,
          data: data,
          backgroundColor: gradient,
          borderColor: '#435739',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
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
          backgroundColor: 'rgba(67, 87, 57, 0.9)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#435739',
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              return `${context.parsed.y} hours`;
            }
          }
        }
      },
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: "#2c3e50",
            font: {
              size: 12,
              weight: '500'
            },
            maxRotation: 45,
            minRotation: 0
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0,0,0,0.1)',
            lineWidth: 1
          },
          ticks: {
            color: "#2c3e50",
            font: {
              size: 12,
              weight: '500'
            },
            callback: function(value) {
              return value + 'h';
            }
          },
          title: {
            display: true,
            text: 'Hours',
            color: '#2c3e50',
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        },
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
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
.bar-chart-container {
  width: 100%;
  max-width: 700px;
  height: 350px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8ecef;
  position: relative;
  overflow: hidden;
}

.bar-chart-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #435739, #81a263, #6b8a4f);
  border-radius: 16px 16px 0 0;
}

canvas {
  width: 100% !important;
  height: 100% !important;
  border-radius: 8px;
}

/* Responsive design */
@media (max-width: 768px) {
  .bar-chart-container {
    max-width: 100%;
    height: 300px;
    padding: 15px;
    margin: 10px 0;
  }
}

@media (max-width: 480px) {
  .bar-chart-container {
    height: 250px;
    padding: 10px;
  }
}
</style>
