<template>
  <div v-if="end" :id="'tec' + index" class="chart-container"></div>
  <div v-else>Sin fecha de entrega</div>
</template>

<script setup>
import * as echarts from "echarts";
import { formatDateplusoneSlim } from "src/boot/formatFunctions";
import { onMounted, watch } from "vue";

// Recibir las propiedades: prod, index, start, end
const { prod, index, start, end } = defineProps([
  "prod",
  "index",
  "start",
  "end",
]);

// Obtener la fecha actual en formato dd/mmm/aaaa
const getFormattedDate = () => {
  const today = new Date();
  return today.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Calcular el progreso basado en las fechas
const calculateProgress = (start, end) => {
  if (!start || !end) return null; // Si falta alguna fecha, retorna null
  const startDate = new Date(start);
  const endDate = new Date(end);
  const currentDate = new Date();

  if (isNaN(startDate) || isNaN(endDate)) return null; // Validar fechas inválidas
  if (currentDate < startDate) return 0; // Antes de la fecha de inicio, progreso 0
  if (currentDate > endDate) return 100; // Después de la fecha de fin, progreso 100

  const totalDuration = endDate - startDate;
  const elapsed = currentDate - startDate;

  const progress = Math.min((elapsed / totalDuration) * 100, 100); // Progreso en porcentaje
  return parseFloat(progress.toFixed(2)); // Limitar a 2 decimales
};

// Renderizar el gráfico
const renderChart = (chartId, title, data) => {
  const chartDom = document.getElementById(chartId);
  if (!chartDom) return; // Asegurarse de que el contenedor existe
  const myChart = echarts.init(chartDom);

  const option = {
    title: {
      show: true,
      text: title, // Fecha actual en el título
      left: "center",
      top: 5,
      textStyle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
      },
    },
    series: [
      {
        type: "gauge",
        progress: {
          show: true,
          width: 10,
          itemStyle: {
            color: colorChange(data.value),
          },
        },
        pointer: {
          itemStyle: {
            color: colorChange(data.value),
          },
        },
        axisLine: {
          lineStyle: {
            width: 10,
          },
        },
        axisTick: {
          show: false, // Quitar los pequeños ticks del eje
        },
        axisLabel: {
          show: false, // Quitar los labels del eje
        },
        splitLine: {
          show: false, // Quitar las líneas de división
        },
        anchor: {
          show: false,
          showAbove: false,
        },
        title: {
          show: false,
        },
        detail: {
          show: true,
          formatter: "Entrega: " + formatDateplusoneSlim(end), // Formato del porcentaje
          valueAnimation: true,
          fontSize: 13, // Tamaño más pequeño para el porcentaje
          offsetCenter: [0, "110%"], // Ajustar la posición del porcentaje
          color: "#333", // Color del porcentaje
        },
        animationDuration: 3000,
        data: [
          {
            value: data.value,
          },
        ],
      },
    ],
  };

  myChart.setOption(option);
};

// Color dinámico para la gráfica
const colorChange = (value) => {
  return value <= 85 ? "#00ff00" : "#ff0000"; // Verde si ≥85, rojo si no
};

// Lógica de montaje
onMounted(() => {
  const progress = calculateProgress(start, end);
  const formattedDate = getFormattedDate();

  if (progress !== null) {
    renderChart("tec" + index, formattedDate, { value: progress });
  }
});

// Actualizar la gráfica si cambian las fechas o el índice
watch([() => start, () => end], ([newStart, newEnd]) => {
  const progress = calculateProgress(newStart, newEnd);
  const formattedDate = getFormattedDate();

  if (progress !== null) {
    renderChart("tec" + index, formattedDate, { value: progress });
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
