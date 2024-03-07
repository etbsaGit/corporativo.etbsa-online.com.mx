<template>
  <q-form class="q-gutter-y-sm" ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <div class="chart-container">
          <canvas ref="pieChart"></canvas>
        </div>
      </q-item-section>
      <q-item-section>
        <q-card>
          <q-card-section>
            Total de preguntas: {{ formScore.questions }}
          </q-card-section>
          <q-card-section>
            Preguntas correctas: {{ formScore.correct }}
          </q-card-section>
          <q-card-section>
            Preguntas incorrectas: {{ formScore.incorrect }}
          </q-card-section>
          <q-card-section>
            Preguntas sin responder: {{ formScore.unanswered }}
          </q-card-section>
          <q-card-section>
            Calificacion: {{ formScore.score }}/100
          </q-card-section>
          <q-card-section>
            Respuestas sin revisar: {{ ungraded }}
          </q-card-section>
          <q-card-section>
            <q-input
              filled
              v-model="formScore.comments"
              dense
              label="Comentario final"
            />
          </q-card-section>
        </q-card>
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";
import { sendRequest } from "src/boot/functions";

const { evaluee, survey } = defineProps(["evaluee", "survey"]);

const myForm = ref(null);
const ungraded = ref(null);

const data = ref({
  labels: ["Correctas", "Incorrectas", "Sin responder"],
  datasets: [
    {
      data: [1, 1, 1],
      backgroundColor: ["green", "red", "gray"],
    },
  ],
});

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
});

const pieChart = ref(null);
const chart = ref(null);

const renderChart = () => {
  if (pieChart.value) {
    if (!chart.value) {
      chart.value = new Chart(pieChart.value, {
        type: "pie",
        data: data.value,
        options: options.value,
      });
    } else {
      chart.value.data = data.value;
      chart.value.update();
    }
  }
};

const formScore = ref({
  comments: null,
  score: null,
  questions: null,
  correct: null,
  incorrect: null,
  unanswered: null,
  evaluee_id: null,
  survey_id: null,
});

const getScore = async () => {
  let res = await sendRequest(
    "GET",
    null,
    `/api/surveys/grade/${evaluee.id}/${survey.id}`,
    ""
  );
  formScore.value.score = res.average_grade;
  formScore.value.questions = res.total_questions;
  formScore.value.correct = res.correct_responses;
  formScore.value.incorrect = res.incorrect_responses;
  formScore.value.unanswered = res.unanswered_responses;
  formScore.value.evaluee_id = evaluee.id;
  formScore.value.survey_id = survey.id;
  ungraded.value = res.ungraded_responses;

  // Actualizar data del gráfico con los valores del formulario
  data.value.datasets[0].data = [
    formScore.value.correct,
    formScore.value.incorrect,
    formScore.value.unanswered,
  ];
  renderChart();
};

onMounted(() => {
  getScore();
});

defineExpose({
  formScore,
  ungraded,
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  /* Hacer que el contenedor del gráfico ocupe todo el ancho disponible */
  height: auto;
  /* Permitir que la altura del contenedor del gráfico se ajuste automáticamente */
}
</style>
