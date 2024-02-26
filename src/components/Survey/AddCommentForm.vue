<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card v-for="survey in surveys" :key="survey.id">
      <q-card-section>
        <div class="text-h6">{{ survey.title }}</div>
        <div class="text-subtitle2">{{ survey.description }}</div>
      </q-card-section>
      <q-separator dark />

      <q-card-actions>
        <q-btn dense color="blue" @click="onRowClick(survey)">Calificar</q-btn>
      </q-card-actions>
    </q-card>
    <q-dialog v-model="showAnswers" transition-show="rotate" transition-hide="rotate" persistent full-width full-height>
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
  </div>
</template>

<script setup>
import { sendRequest } from "src/boot/functions";
import { ref, onMounted } from 'vue'
import InsertCommentForm from "src/components/Survey/InsertCommentForm.vue"

const { empleado } = defineProps(["empleado"]);
const surveys = ref([])
const showAnswers = ref(false)
const selectedSurvey = ref(null)
const answers = ref(null)

const getSurveys = async () => {
  const id = empleado.user_id
  let res = await sendRequest("GET", null, "/api/survey/user/" + id, "");
  surveys.value = res;
};

const onRowClick = (row) => {
  selectedSurvey.value = row;
  showAnswers.value = true;
};

onMounted(() => {
  getSurveys()
});
</script>
