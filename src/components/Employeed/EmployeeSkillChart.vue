<template>
  <div class="q-pa-none">
    <canvas ref="radarChart" class="chart-container"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";

const { ratings } = defineProps({
  ratings: {
    type: Array,
    required: true,
  },
});

const radarChart = ref(null);
const chart = ref(null);

const data = ref({
  labels: [],
  datasets: [
    {
      label: "Nivel de competencia",
      data: [],
      backgroundColor: "rgba(34, 139, 34, 0.3)", // verde pasto semitransparente
      borderColor: "rgba(34, 139, 34, 1)", // verde pasto sólido
      borderWidth: 2,
      pointBackgroundColor: "rgba(34, 139, 34, 1)",
    },
  ],
});

const options = ref({
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },

    tooltip: {
      callbacks: {
        label: function (context) {
          const index = context.dataIndex;
          const item = ratings[index];

          const nivel = item.nivel?.nivel ?? "N/A";
          const nombreNivel = item.nivel?.nombre ?? "Sin nivel";
          const definicion = item.definicion ?? "Sin definición";
          const evidencia = item.evidencia ?? "Sin evidencia";

          return [
            `Nivel: ${nivel} - ${nombreNivel}`,
            `Definición: ${definicion}`,
            `Evidencia: ${evidencia}`,
          ];
        },
      },
    },
  },
  layout: {
    padding: {
      top: 0, // 👈 elimina todo el padding superior
      bottom: 300,
      left: 0,
      right: 0,
    },
  },
  scales: {
    r: {
      min: 0,
      max: 5,
      ticks: { stepSize: 1 },
      pointLabels: { font: { size: 12 } },
    },
  },
});

const renderChart = () => {
  if (!radarChart.value) return;

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
};

const loadData = () => {
  data.value.labels = ratings.map(
    (item) => item.soft_skill?.nombre ?? "Sin skill"
  );
  data.value.datasets[0].data = ratings.map((item) => item.nivel?.nivel ?? 0); // 0 por defecto
  renderChart();
};

onMounted(loadData);

// Si el JSON cambia dinámicamente
watch(() => ratings, loadData, { deep: true });
</script>
