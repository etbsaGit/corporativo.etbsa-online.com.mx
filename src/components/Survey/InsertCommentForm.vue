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
          <!-- Agrega el q-input para comentarios -->
          <q-separator v-if="pregunta.respuestaAsignada" />
          <q-input v-if="pregunta.respuestaAsignada" v-model="pregunta.comments" label="Comentario" filled dense
            :value="pregunta.comments">
            <template v-slot:after>
              <q-btn color="primary" @click="sendComments(pregunta)" round dense flat icon="send" />
            </template>
          </q-input>
          <!-- Checkbox que se marca/desmarca según el valor del ranking -->
          <q-checkbox v-if="pregunta.respuestaAsignada" v-model="pregunta.rating" true-value="1" false-value="0"
            checked-icon="task_alt" unchecked-icon="highlight_off" color="green">
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
        pregunta.rating = respuesta.rating.toString(); // Convertir a string para que coincida con los valores de true-value y false-value
      }
    }
  } catch (error) {
    console.error("Error al obtener las respuestas:", error);
  }
}

const sendComments = async (pregunta) => {
  const comments = { comments: pregunta.comments, rating: pregunta.rating }
  try {
    let res = await sendRequest("PUT", comments, "/api/survey/answer/" + pregunta.respuesta_id, "");
    getAnswers()
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
}

onMounted(() => {
  getAnswers()
});

</script>

