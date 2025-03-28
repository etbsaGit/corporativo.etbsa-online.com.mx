<template>
  <div class="grid-container">
    <q-card
      v-for="evaluee in evaluees"
      :key="evaluee.id"
      :class="{
        'bg-yellow-3': tieneRespuestasSinCalificar(evaluee),
        'bg-orange-3': sinCalificacion(evaluee),
        'col-3': true,
      }"
    >
      <q-item>
        <q-item-section avatar>
          <q-avatar
            color="primary"
            text-color="white"
            v-if="evaluee.empleado.picture"
            size="60px"
          >
            <img :src="evaluee.empleado.picture" alt="Foto del empleado" />
          </q-avatar>
          <q-avatar v-else color="primary" text-color="white" size="60px">
            {{ evaluee.empleado.nombre.charAt(0).toUpperCase()
            }}{{ evaluee.empleado.apellido_paterno.charAt(0).toUpperCase() }}
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-grey-8 text-weight-bold">
            {{ evaluee.empleado.nombreCompleto }}
          </q-item-label>

          <q-item-label class="text-grey-8">
            {{ evaluee.email }}
          </q-item-label>
        </q-item-section>
        <q-tooltip
          v-if="tieneRespuestasSinCalificar(evaluee)"
          class="bg-purple text-body2"
        >
          Tienes nuevas respuestas que calificar a este usuario
        </q-tooltip>
        <q-tooltip
          v-else-if="sinCalificacion(evaluee)"
          class="bg-purple text-body2"
        >
          El usuario no tiene calificacion final
        </q-tooltip>
      </q-item>
      <q-separator />
      <q-card-actions vertical>
        <q-btn dense color="blue" @click="onRowClick(evaluee)">Preguntas</q-btn>
        <q-btn
          v-if="survey.status == 0"
          dense
          color="green"
          @click="onRowClickScore(evaluee)"
        >
          Evaluacion
        </q-btn>
      </q-card-actions>
    </q-card>

    <q-dialog
      v-model="showAnswers"
      transition-show="rotate"
      transition-hide="rotate"
      persistent
      :maximized="true"
    >
      <q-layout view="hHh Lpr fff">
        <q-header elevated class="bg-primary text-white" height-hint="98">
          <q-toolbar>
            <q-toolbar-title>
              Respuestas de {{ selectedEvaluee.name }}
            </q-toolbar-title>
            <q-card-actions align="right">
              <q-btn
                label="Cerrar"
                color="red"
                v-close-popup
                @click="getEvaluees"
              />
            </q-card-actions>
          </q-toolbar>
        </q-header>

        <q-page-container class="bg-white">
          <insert-comment-form
            ref="answers"
            :evaluee="selectedEvaluee"
            :survey="selectedsurvey"
          />
        </q-page-container>
      </q-layout>
    </q-dialog>

    <q-dialog
      v-model="showScore"
      transition-show="rotate"
      transition-hide="rotate"
      persistent
      full-width
    >
      <q-card>
        <q-card-section class="d-flex justify-between items-center q-pa-sm">
          <div class="text-h6">
            Evaluacion final de {{ selectedEvaluee.name }}
          </div>
          <q-card-actions align="right">
            <q-btn
              label="Cerrar"
              color="red"
              v-close-popup
              @click="getEvaluees"
            />
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
const calificaciones = ref([]);
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
  getGrades();
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
  getEvaluees();
};

const getGrades = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/grades/survey/" + survey.id,
    ""
  );
  calificaciones.value = res.grades;
};

const tieneRespuestasSinCalificar = (evaluee) => {
  const preguntas = selectedsurvey.value.question;
  return preguntas.some((pregunta) => {
    return evaluee.answer.some((respuesta) => {
      return respuesta.rating === null && respuesta.question_id === pregunta.id;
    });
  });
};

const sinCalificacion = (evaluee) => {
  const tieneCalificacion = calificaciones.value.some(
    (calificacion) => calificacion.evaluee_id === evaluee.id
  );
  return !tieneCalificacion;
};

onMounted(() => {
  getEvaluees();
});
</script>

<style>
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

.grid-container {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(300px, 1fr)
  ); /* Ajusta el tamaño mínimo aquí 200px para que sean 6 y 300px para 4 px*/
  gap: 10px;
}
</style>
