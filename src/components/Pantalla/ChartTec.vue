<template>
  <div :id="'tec' + index" class="chart-container"></div>
</template>

<script setup>
import * as echarts from "echarts";
import { onMounted } from "vue";

const { prod, index } = defineProps(["prod", "index"]);

const renderChart = (chartId, title, data) => {
  const chartDom = document.getElementById(chartId);
  const myChart = echarts.init(chartDom);

  const option = {
    title: {
      text: title,
      left: "center",
      top: -5,
    },
    series: [
      {
        type: "gauge",
        progress: {
          show: true,
          width: 10,
          itemStyle: {
            color: colorChange(prod),
          },
        },
        pointer: {
          itemStyle: {
            color: colorChange(prod),
          },
        },
        axisLine: {
          lineStyle: {
            width: 10,
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false, // Esta línea oculta los números de fondo
        },
        splitLine: {
          show: false,
        },
        anchor: {
          show: false,
          showAbove: false,
        },
        title: {
          show: false,
        },
        detail: {
          formatter: "{value}%",
          valueAnimation: false,
          fontSize: 30,
          offsetCenter: [0, "100%"],
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

onMounted(() => {
  renderChart("tec" + index, "Productividad", {
    value: prod,
  });
});

const colorChange = (prod) => {
  if (prod >= 85) {
    return "#00ff00"; // Verde si el valor es mayor o igual a 85
  } else {
    return "#ff0000"; // Rojo si el valor es menor a 85
  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>


