<template>
  <q-item class="my-charts-container">
    <q-item-section class="chart">
      <div id="bay" class="chart-container"></div>
    </q-item-section>
    <q-item-section class="chart">
      <div id="tech" class="chart-container"></div>
    </q-item-section>
    <q-item-section class="chart">
      <div id="desemp" class="chart-container"></div>
    </q-item-section>
  </q-item>
</template>

<script setup>
import * as echarts from "echarts";
import { onMounted } from "vue";

const { data } = defineProps(["data"]);

const renderChart = (chartId, title, data) => {
  const chartDom = document.getElementById(chartId);
  const myChart = echarts.init(chartDom);

  const option = {
    title: {
      text: title,
      left: "center",
      textStyle: {
        fontSize: 40, // Tamaño de la fuente del título
        fontWeight: "bold", // Negrita del título
        color: "#333", // Color del texto del título
      },
    },
    tooltip: {
      formatter: "{a} <br/>{b} : {c}%",
    },
    series: [
      {
        name: "Pressure",
        type: "gauge",
        progress: {
          show: true,
        },
        detail: {
          valueAnimation: true,
          formatter: "{value}%",
        },
        animationDuration: 2000,
        data: [
          {
            value: data.value,
            name: data.name,
          },
        ],
      },
    ],
  };

  myChart.setOption(option);
};

onMounted(() => {
  renderChart("bay", "Utilizacion taller", {
    value: data.en_uso.toFixed(2),
    name: "% Bahias en uso",
  });
  renderChart("tech", "Productividad taller", {
    value: data.prod_taller.toFixed(2),
    name: "Productividad taller",
  });
  renderChart("desemp", "Desempeño taller", {
    value: data.desempeno.toFixed(2),
    name: "Desempeño taller",
  });
});
</script>

<style scoped>
.my-charts-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 85vh;
  box-sizing: border-box;
}

.chart {
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-container {
  width: 100%; /* Ajusta el ancho del gráfico */
  height: 100%; /* Ajusta la altura del gráfico */
}
</style>
