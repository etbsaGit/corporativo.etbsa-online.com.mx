<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card
      v-for="evaluee in evaluees"
      :key="evaluee.id"
      :class="{ 'bg-yellow-3': tieneRespuestasSinCalificar(evaluee) }"
    >
      <q-card-section>
        <div class="text-h6">{{ evaluee.name }}</div>
        <div class="text-subtitle2">{{ evaluee.email }}</div>
        <q-tooltip
          v-if="tieneRespuestasSinCalificar(evaluee)"
          class="bg-purple text-body2"
        >
          Tienes nuevas respuestas que calificar a este usuario
        </q-tooltip>
      </q-card-section>
      <q-separator />
      <q-card-actions>
        <q-btn dense color="blue" @click="onRowClick(evaluee)">Preguntas</q-btn>
        <q-btn dense color="green" @click="onRowClickScore(evaluee)"
          >Evaluacion</q-btn
        >
      </q-card-actions>
    </q-card>

    <q-dialog
      v-model="showAnswers"
      transition-show="rotate"
      transition-hide="rotate"
      persistent
      full-width
      full-height
    >
      <q-card>
        <q-card-section class="d-flex justify-between items-center">
          <div class="text-h6">Respuestas de {{ selectedEvaluee.name }}</div>
          <q-card-actions align="right">
            <q-btn
              label="Cerrar"
              color="red"
              v-close-popup
              @click="getEvaluees"
            />
          </q-card-actions>
        </q-card-section>
        <q-separator />
        <div class="survey-form-container">
          <insert-comment-form
            ref="answers"
            :evaluee="selectedEvaluee"
            :survey="selectedsurvey"
          />
        </div>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showScore"
      transition-show="rotate"
      transition-hide="rotate"
      persistent
      full-width
    >
      <q-card>
        <q-card-section class="d-flex justify-between items-center">
          <div class="text-h6">
            Evaluacion final de {{ selectedEvaluee.name }}
          </div>
          <q-card-actions align="right">
            <q-btn label="Cerrar" color="red" v-close-popup />
            <q-btn
              label="Guardar comentarios"
              color="blue"
              @click="sendComments"
            />
          </q-card-actions>
        </q-card-section>
        <q-separator />
        <div class="survey-form-container">
          <add-score-form
            ref="score"
            :evaluee="selectedEvaluee"
            :survey="selectedsurvey"
          />
        </div>
        <q-separator />
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { sendRequest } from "src/boot/functions";
import { ref, onMounted } from "vue";
import InsertCommentForm from "src/components/Survey/InsertCommentForm.vue";
import AddScoreForm from "./AddScoreForm.vue";
import { useQuasar } from "quasar";

const { survey } = defineProps(["survey"]);
const selectedsurvey = ref(survey);
const evaluees = ref([]);
const showAnswers = ref(false);
const showScore = ref(false);
const selectedEvaluee = ref(null);
const answers = ref(null);
const score = ref(null);
const $q = useQuasar();

const onRowClick = (row) => {
  selectedEvaluee.value = row;
  showAnswers.value = true;
};

const onRowClickScore = (row) => {
  selectedEvaluee.value = row;
  showScore.value = true;
};

const getEvaluees = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/surveys/evaluees/" + survey.id,
    ""
  );
  evaluees.value = res;
};

const sendComments = async () => {
  if (score.value.ungraded > 0) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Califique primero todas las preguntas",
    });
    return;
  }
  if (score.value.formScore.comments === null) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Agregue un comentario",
    });
    return;
  }
  const final = {
    ...score.value.formScore,
  };
  let res = await sendRequest("POST", final, "/api/surveys/grade", "");
  showScore.value = false;
};

const tieneRespuestasSinCalificar = (evaluee) => {
  const preguntas = selectedsurvey.value.question;
  return preguntas.some((pregunta) => {
    return evaluee.answer.some((respuesta) => {
      return respuesta.rating === null && respuesta.question_id === pregunta.id;
    });
  });
};

onMounted(() => {
  getEvaluees();
});
</script>

<style>
.my-table-details {
  font-size: 0.85em;
  font-style: italic;
  max-width: 200px;
  white-space: normal;
  color: #555;
  margin-top: 4px;
}
.d-flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.survey-form-container {
  max-height: 600px; /* Ajusta este valor según tus necesidades */
  overflow-y: auto;
}

.survey-form-container-score {
  max-height: 400px; /* Ajusta este valor según tus necesidades */
  overflow-y: auto;
}

.bg-yellow-3 {
  background-color: #fff59d !important;
}
</style>
