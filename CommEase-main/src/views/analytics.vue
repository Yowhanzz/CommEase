npm install vue-chartjs chart.js
<template>
  <div>
    <h2>Analytics Dashboard</h2>

    <!-- Bar Chart Container with controlled size -->
    <div class="chart-container bar-chart">
      <h3>Monthly Sales (Bar Chart)</h3>
      <Bar :data="barChartData" :options="barChartOptions" />
    </div>

    <!-- Pie Chart Container with controlled size -->
    <div class="chart-container pie-chart">
      <h3>Product Distribution (Pie Chart)</h3>
      <Pie :data="pieChartData" :options="pieChartOptions" />
    </div>

    <!-- Line Chart Container with controlled size -->
    <div class="chart-container line-chart">
      <h3>Sales Trends (Line Chart)</h3>
      <Line :data="lineChartData" :options="lineChartOptions" />
    </div>
  </div>
</template>

<script>
// Import necessary components from Vue and Chart.js
import { Bar, Pie, Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, LineElement } from 'chart.js'

// Register the necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, LineElement)

export default {
  components: {
    Bar,
    Pie,
    Line
  },
  data() {
    return {
      // Bar Chart Data
      barChartData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Monthly Sales',
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
            borderWidth: 1
          }
        ]
      },
      // Bar Chart Options
      barChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Sales Data Over 6 Months'
          }
        }
      },

      // Pie Chart Data
      pieChartData: {
        labels: ['Electronics', 'Clothing', 'Food', 'Toys'],
        datasets: [
          {
            label: 'Product Distribution',
            data: [300, 150, 200, 100],
            backgroundColor: ['#FF5733', '#42A5F5', '#FFEB3B', '#8BC34A'],
            borderColor: ['#FF5733', '#42A5F5', '#FFEB3B', '#8BC34A'],
            borderWidth: 1
          }
        ]
      },
      // Pie Chart Options
      pieChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Product Categories Distribution'
          }
        }
      },

      // Line Chart Data
      lineChartData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Sales Over Time',
            data: [45, 80, 65, 90, 70, 85],
            borderColor: '#FF5733', // Line color
            backgroundColor: 'rgba(255, 87, 51, 0.2)', // Line background color
            fill: true, // To fill the area under the line
            tension: 0.4 // Smooth the curve of the line
          }
        ]
      },
      // Line Chart Options
      lineChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Sales Trends Over 6 Months'
          }
        }
      }
    }
  }
}
</script>

<style scoped>
/* General styling for all chart containers */
.chart-container {
  margin-bottom: 30px;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%; /* Full width by default */
}

/* Styling specifically for Bar Chart Container */
.chart-container.bar-chart {
  background-color: #f1f8ff; /* Light blue background for Bar Chart */
  border: 2px solid #42A5F5; /* Blue border */
  height: 500px; /* Set height for Bar Chart */
}

/* Styling specifically for Pie Chart Container */
.chart-container.pie-chart {
  background-color: #fff3e0; /* Light orange background for Pie Chart */
  border: 2px solid #FF5733; /* Red-orange border */
  height: 400px; /* Set height for Pie Chart */
}

/* Styling specifically for Line Chart Container */
.chart-container.line-chart {
  background-color: #e0f7fa; /* Light cyan background for Line Chart */
  border: 2px solid #FF5733; /* Red border */
  height: 400px; /* Set height for Line Chart */
}

/* Styling the chart titles */
.chart-container > h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
}

/* Ensure that the chart canvas (inside the container) takes the full size of its parent */
.chart-container > div {
  width: 100%;
  height: 100%; /* Ensures the canvas takes full height of the container */
}
</style>
