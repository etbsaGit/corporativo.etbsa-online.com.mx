<template>
  <q-form class="q-gutter-y-sm" ref="myForm" greedy>
    <q-item v-for="pregunta in survey.question" :key="pregunta.id">
      <q-item-section>
        <q-item-label overline>{{ pregunta.question }}</q-item-label>
        <q-item-label caption>{{ pregunta.description }}</q-item-label>
        <q-input label="Escribe tu respuesta" v-if="pregunta.type === 'textarea'" v-model="pregunta.respuesta"
          :disable="pregunta.respuestaAsignada" filled dense>
          <template v-slot:after>
            <q-btn v-if="pregunta.type !== 'hidden' && !pregunta.respuestaAsignada" color="primary"
              @click="enviarRespuesta(pregunta)" round dense flat icon="send" label="Enviar respuesta" />
          </template>
        </q-input>
        <div v-if="pregunta.type === 'select'">
          <q-select v-model="pregunta.respuesta" :options="pregunta.data.map(item => item.data)"
            label="Selecciona tu respuesta" :disable="pregunta.respuestaAsignada" filled dense>
            <template v-slot:after>
              <q-btn v-if="pregunta.type !== 'hidden' && !pregunta.respuestaAsignada" color="primary"
                @click="enviarRespuesta(pregunta)" round dense flat icon="send" label="Enviar respuesta" />
            </template>
          </q-select>
        </div>

        <div v-if="pregunta.type === 'checkbox'">
          <q-item>
            <q-option-group v-model="pregunta.respuesta"
              :options="pregunta.data.map(item => ({ value: item.data, label: item.data }))"
              :disable="pregunta.respuestaAsignada" inline>
            </q-option-group>
            <q-btn class="q-ml-auto" v-if="pregunta.type !== 'hidden' && !pregunta.respuestaAsignada" color="primary"
              @click="enviarRespuesta(pregunta)" round dense flat icon="send" label="Enviar respuesta" />
          </q-item>
        </div>


      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from "quasar";
import { sendRequest } from "src/boot/functions";

const { survey } = defineProps(["survey"]);
const myForm = ref(null);
const $q = useQuasar();

// Método para inicializar las respuestas en cada pregunta
for (const pregunta of survey.question) {
  pregunta.respuesta = '';
  pregunta.respuestaAsignada = false; // Nueva propiedad para indicar si la respuesta está asignada
}

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
      }
    }
    $q.notify({
      color: "green-5",
      textColor: "white",
      icon: "check",
      message: "Puedes comenzar"
    });
  } catch (error) {
    console.error("Error al obtener las respuestas:", error);
  }
}

const enviarRespuesta = async (pregunta) => {
  if (!pregunta.respuesta.trim()) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "La respuesta está vacía"
    });
    return;
  }

  formAnswer.value.question_id = pregunta.id,
    formAnswer.value.answer = pregunta.respuesta

  try {
    let res = await sendRequest("POST", formAnswer.value, "/api/survey/answer", "");
    getAnswers()
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
};

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

