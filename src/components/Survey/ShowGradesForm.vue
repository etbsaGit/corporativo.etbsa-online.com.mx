<template>
  <div class="chart-container">
    <canvas ref="barChart"></canvas>
  </div>
  <div class="q-pa-md">
    <q-table
      title="Calificaciones"
      :rows="sortedGrades"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:body-cell-empleado="props">
        <q-td :props="props">
          {{ props.row.evaluee.empleado.nombre }}
          {{ props.row.evaluee.empleado.apellido_paterno }}
          {{ props.row.evaluee.empleado.apellido_materno }}
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { sendRequest } from "src/boot/functions";
import Chart from "chart.js/auto";

const { survey } = defineProps(["survey"]);

const grades = ref([]);
const questions = ref([]);
const answers = ref([]);
const unanswered = ref([]);

const columns = [
  {
    name: "empleado",
    label: "Empleado",
    align: "left",
    field: "empleado",
    sortable: true,
  },
  {
    name: "comments",
    label: "Comentarios",
    align: "left",
    field: "comments",
    sortable: true,
  },
  {
    name: "score",
    label: "Calificacion",
    align: "left",
    field: "score",
    sortable: true,
  },
  {
    name: "questions",
    label: "Preguntas",
    align: "left",
    field: "questions",
    sortable: true,
  },
  {
    name: "correct",
    label: "Correctas",
    align: "left",
    field: "correct",
    sortable: true,
  },
  {
    name: "incorrect",
    label: "Incorrectas",
    align: "left",
    field: "incorrect",
    sortable: true,
  },
  {
    name: "unanswered",
    label: "Sin responder",
    align: "left",
    field: "unanswered",
    sortable: true,
  },
  {
    name: "created_at",
    label: "Cuando se califico",
    align: "left",
    field: (row) => formatDate(row.created_at),
    sortable: true,
  },
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const sortedGrades = computed(() => {
  return grades.value
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

const data = ref({
  labels: [],
  datasets: [
    {
      label: "Correctas",
      data: [],
      backgroundColor: "rgba(0, 255, 0, 0.2)", // Verde con transparencia
      borderColor: "rgba(0, 255, 0, 1)", // Verde sólido
      borderWidth: 1,
      stack: 1,
    },
    {
      label: "Incorrectas",
      data: [],
      backgroundColor: "rgba(255, 0, 0, 0.2)", // Rojo con transparencia
      borderColor: "rgba(255, 0, 0, 1)", // Rojo sólido
      borderWidth: 1,
      stack: 0,
    },
    {
      label: "Sin responder",
      data: [],
      backgroundColor: "rgba(128, 128, 128, 0.2)", // Gris con transparencia
      borderColor: "rgba(128, 128, 128, 1)", // Gris sólido
      borderWidth: 1,
      stack: 2,
    },
  ],
});

const options = ref({
  responsive: true,
  interaction: {
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      ticks: {
        precision: 0, // Define la precisión del valor del tick como 0 para mostrar solo números enteros
      },
    },
  },
});

const barChart = ref(null);
const chart = ref(null);

const renderChart = () => {
  if (barChart.value) {
    if (!chart.value) {
      chart.value = new Chart(barChart.value, {
        type: "bar",
        data: data.value,
        options: options.value,
      });
    } else {
      chart.value.data = data.value;
      chart.value.update();
    }
  }
};

const getGrades = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/grades/survey/" + survey.id,
    ""
  );
  grades.value = res.grades;
  questions.value = res.questions;
  answers.value = res.answers;
  unanswered.value = res.unanswered;

  data.value.datasets[0].data = Array(questions.value.length).fill(0);
  data.value.datasets[1].data = Array(questions.value.length).fill(0);
  data.value.datasets[2].data = Array(questions.value.length).fill(0);

  questions.value.forEach((question, questionIndex) => {
    data.value.labels.push(question.question);

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    question.answer.forEach((answer) => {
      if (answer.rating === 1) {
        correctCount++;
      } else if (answer.rating === 0) {
        incorrectCount++;
      }
    });

    data.value.datasets[0].data[questionIndex] = correctCount;
    data.value.datasets[1].data[questionIndex] = incorrectCount;

    // Verificar si unanswered.value está definido antes de usar filter()
    if (unanswered.value) {
      // Contar la cantidad de veces que aparece el ID de la pregunta en unanswered
      unansweredCount = unanswered.value.filter(
        (id) => id === question.id
      ).length;
    }
    data.value.datasets[2].data[questionIndex] = unansweredCount;
  });
  renderChart();
};

onMounted(() => {
  getGrades();
});
</script>

<style scoped>
.chart-container {
  width: 50%;
  /* Hacer que el contenedor del gráfico ocupe todo el ancho disponible */
  height: auto;
  /* Permitir que la altura del contenedor del gráfico se ajuste automáticamente */
  margin-left: auto;
  /* Centrar el contenido del contenedor en el lado izquierdo */
  margin-right: auto;
  /* Centrar el contenido del contenedor en el lado derecho */
}
</style>
