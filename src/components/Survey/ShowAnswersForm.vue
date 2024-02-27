<template>
  <q-form class="q-gutter-y-sm" ref="myForm" greedy>
    <q-list separator>
      <q-item v-for="pregunta in survey.question" :key="pregunta.id">
        <q-item-section>
          <q-item-label overline>{{ pregunta.question }}</q-item-label>
          <q-item-label caption>{{ pregunta.description }}</q-item-label>
          <q-input label="Tu respuesta" v-if="pregunta.type === 'textarea'" v-model="pregunta.respuesta" filled dense
            disable>
          </q-input>
          <div v-if="pregunta.type === 'select'">
            <q-select v-model="pregunta.respuesta" :options="pregunta.data.map(item => item.data)" label="Tu respuesta"
              disable filled dense />
          </div>
          <q-item-label caption v-if="pregunta.respuestaAsignada">
            <span v-if="pregunta.comments !== ''">Comentarios: {{ pregunta.comments }}</span>
          </q-item-label>
          <q-checkbox v-if="pregunta.respuestaAsignada" v-model="pregunta.rating" true-value="1" false-value="0"
            checked-icon="task_alt" unchecked-icon="highlight_off" color="green" disable>

            <q-item-label v-if="pregunta.respuestaAsignada && pregunta.rating === '1'" caption style="color: green;">
              La respuesta es correcta
            </q-item-label>

            <q-item-label v-if="pregunta.respuestaAsignada && pregunta.rating === '0'" caption style="color: red;">
              La respuesta no es correcta
            </q-item-label>
          </q-checkbox>

        </q-item-section>
      </q-item>
    </q-list>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { sendRequest } from "src/boot/functions";

const { survey } = defineProps(["survey"]);
const myForm = ref(null);

const formAnswer = ref({
  evaluee_id: survey.pivot.evaluee_id,
  question_id: null,
  answer: null
})

const getAnswers = async () => {
  try {
    let res = await sendRequest("GET", null, `/api/survey/answer/${survey.id}/${survey.pivot.evaluee_id}`, "");
    for (const pregunta of survey.question) {
      const respuesta = res.find(ans => ans.question_id === pregunta.id);
      if (respuesta) {
        pregunta.respuesta = respuesta.answer;
        pregunta.respuestaAsignada = true; // Marcar como respuesta asignada
        pregunta.comments = respuesta.comments; // Asignar comentarios
        pregunta.respuesta_id = respuesta.id
        pregunta.rating = respuesta.rating.toString();
      }
    }
  } catch (error) {
    console.error("Error al obtener las respuestas:", error);
  }
}

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getAnswers()
});

defineExpose({
  formAnswer,
  validate
});
</script>



