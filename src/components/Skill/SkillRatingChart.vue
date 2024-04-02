<template>
  <div class="q-pa-md">
    <canvas ref="radarChart" class="chart-container"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

const { ratings } = defineProps(["ratings"]);

const radarChart = ref(null);
const chart = ref(null);

const data = ref({
  labels: [],
  datasets: [
    {
      label: "Rating",
      data: [],
      backgroundColor: "rgba(128, 0, 128, 0.2)", // Morado con transparencia
      borderColor: "rgba(128, 0, 128, 1)", // Morado sólido
    },
  ],
});

const options = ref({
  responsive: true,
  plugins: {},
  scales: {
    r: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 20,
      },
    },
  },
});

const renderChart = () => {
  if (radarChart.value) {
    if (!chart.value) {
      chart.value = new Chart(radarChart.value, {
        type: "radar",
        data: data.value,
        options: options.value,
      });
    } else {
      chart.value.data = data.value;
      chart.value.update();
    }
  }
};

onMounted(() => {
  data.value.labels = ratings.map((entry) => entry.skill.name);
  data.value.datasets[0].data = ratings.map((entry) => entry.rating);
  renderChart();
});
</script>
