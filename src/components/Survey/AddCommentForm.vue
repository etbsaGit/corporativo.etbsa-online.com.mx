<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card v-for="survey in surveys" :key="survey.id">
      <q-card-section>
        <div class="text-h6">{{ survey.title }}</div>
        <div class="text-subtitle2">{{ survey.description }}</div>
      </q-card-section>
      <q-separator dark />

      <q-card-actions>
        <q-btn dense color="blue" @click="onRowClick(survey)">Preguntas</q-btn>
        <q-btn dense color="green" @click="onRowClickScore(survey)"
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
        <q-card-section>
          <div class="text-h6">Respuestas de {{ selectedSurvey.title }}</div>
        </q-card-section>
        <q-separator />
        <q-card class="q-pa-none scroll" flat>
          <insert-comment-form ref="answers" :survey="selectedSurvey" />
        </q-card>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showScore"
      transition-show="rotate"
      transition-hide="rotate"
      persistent
      full-width
      full-height
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Evaluacion final de {{ selectedSurvey.title }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card class="q-pa-none scroll" flat>
          <add-score-form ref="score" :survey="selectedSurvey" />
        </q-card>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
          <q-btn
            label="Guardar comentarios"
            color="blue"
            @click="sendComments"
          />
        </q-card-actions>
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

const { empleado } = defineProps(["empleado"]);
const surveys = ref([]);
const showAnswers = ref(false);
const showScore = ref(false);
const selectedSurvey = ref(null);
const answers = ref(null);
const score = ref(null);
const $q = useQuasar();

const getSurveys = async () => {
  const id = empleado.user_id;
  let res = await sendRequest("GET", null, "/api/survey/user/" + id, "");
  surveys.value = res;
};

const onRowClick = (row) => {
  selectedSurvey.value = row;
  showAnswers.value = true;
};

const onRowClickScore = (row) => {
  selectedSurvey.value = row;
  showScore.value = true;
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
  const final = {
    ...score.value.formScore,
  };
  let res = await sendRequest("POST", final, "/api/surveys/grade", "");
  showScore.value = false;
};

onMounted(() => {
  getSurveys();
});
</script>
