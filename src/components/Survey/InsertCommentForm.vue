<template>
  <q-form class="q-gutter-y-sm" ref="myForm" greedy>
    <q-list bordered separator>
      <q-item v-for="pregunta in survey.question" :key="pregunta.id">
        <q-item-section>
          <q-item-label overline>{{ pregunta.question }}</q-item-label>
          <q-item-label caption>{{ pregunta.description }}</q-item-label>
          <q-img
            v-if="pregunta.imagen"
            :src="pregunta.imagen"
            style="height: 240px; max-width: 250px"
          >
            <q-icon
              class="absolute all-pointer-events"
              size="32px"
              name="info"
              color="white"
              style="top: 8px; left: 8px"
            >
              <q-btn
                size="10px"
                color="blue"
                icon="open_in_full"
                @click="show(pregunta.imagen)"
              />
            </q-icon>
          </q-img>
          <br />
          <q-input
            v-if="pregunta.type === 'text'"
            v-model="pregunta.respuesta"
            disable
            outlined
            dense
            placeholder="Sin respuesta aun"
          >
          </q-input>
          <div v-if="pregunta.type === 'select'">
            <q-select
              v-model="pregunta.respuesta"
              :options="pregunta.data.map((item) => item.data)"
              disable
              outlined
              dense
            >
            </q-select>
          </div>

          <div v-if="pregunta.type === 'radio'">
            <q-item>
              <q-option-group
                v-model="pregunta.respuesta"
                :options="
                  pregunta.data.map((item) => ({
                    value: item.data,
                    label: item.data,
                  }))
                "
                disable
                inline
              >
              </q-option-group>
            </q-item>
          </div>

          <div v-if="pregunta.type === 'checkbox'">
            <q-item>
              <q-option-group
                v-model="pregunta.respuesta"
                :options="
                  pregunta.data.map((item) => ({
                    value: item.data,
                    label: item.data,
                  }))
                "
                disable
                inline
                type="checkbox"
              >
              </q-option-group>
            </q-item>
          </div>

          <!-- Agrega el q-input para comentarios -->
          <q-separator v-if="pregunta.respuestaAsignada" />
          <q-input
            v-if="pregunta.respuestaAsignada"
            v-model="pregunta.comments"
            label="Comentario"
            filled
            dense
            :value="pregunta.comments"
          >
            <template v-slot:after>
              <q-btn
                color="primary"
                @click="sendComments(pregunta)"
                round
                dense
                flat
                icon="send"
                label="Enviar retroalimentacion"
              />
            </template>
          </q-input>
          <!-- Checkbox que se marca/desmarca según el valor del ranking -->
          <q-checkbox
            v-if="pregunta.respuestaAsignada"
            v-model="pregunta.rating"
            :true-value="1"
            :false-value="0"
            checked-icon="task_alt"
            unchecked-icon="highlight_off"
            :color="getColor(pregunta.rating)"
          >
            <q-item-label
              v-if="pregunta.respuestaAsignada && pregunta.rating === 1"
              caption
              style="color: green"
            >
              La respuesta es correcta
            </q-item-label>

            <q-item-label
              v-if="pregunta.respuestaAsignada && pregunta.rating === 0"
              caption
              style="color: red"
            >
              La respuesta no es correcta
            </q-item-label>

            <q-item-label
              v-if="pregunta.respuestaAsignada && pregunta.rating === null"
              caption
              style="color: purple"
            >
              Sin calificar
            </q-item-label>
          </q-checkbox>
        </q-item-section>
      </q-item>
    </q-list>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { evaluee, survey } = defineProps(["evaluee", "survey"]);
const myForm = ref(null);

const getColor = (value) => {
  return value === 1 ? "green" : "red"; // Cambia el color a verde cuando el valor es 1, de lo contrario, a rojo
};

// Método para inicializar las respuestas en cada pregunta
for (const pregunta of survey.question) {
  if (pregunta.type === "checkbox") {
    pregunta.respuesta = [];
    pregunta.respuestaAsignada = false;
  } else {
    pregunta.respuesta = "";
    pregunta.respuestaAsignada = false;
  }
}

const getAnswers = async () => {
  let res = await sendRequest(
    "GET",
    null,
    `/api/survey/answer/${survey.id}/${evaluee.id}`,
    ""
  );
  for (const pregunta of survey.question) {
    const respuesta = res.find((ans) => ans.question_id === pregunta.id);
    if (respuesta) {
      pregunta.respuestaAsignada = true;
      if (pregunta.type === "checkbox") {
        const respuestasSeleccionadas = respuesta.answer.split("|");
        pregunta.respuesta = [];
        for (const respuestaSeleccionada of respuestasSeleccionadas) {
          pregunta.respuesta.push(respuestaSeleccionada.trim());
        }
      } else {
        pregunta.respuesta = respuesta.answer;
      }
    }
  }
};

const getAnswersfirst = async () => {
  let res = await sendRequest(
    "GET",
    null,
    `/api/survey/answer/${survey.id}/${evaluee.id}`,
    ""
  );
  for (const pregunta of survey.question) {
    const respuesta = res.find((ans) => ans.question_id === pregunta.id);
    if (respuesta) {
      pregunta.respuestaAsignada = true;
      pregunta.comments = respuesta.comments; // Asignar comentarios
      pregunta.respuesta_id = respuesta.id;
      pregunta.rating = respuesta.rating;
      if (pregunta.type === "checkbox") {
        const respuestasSeleccionadas = respuesta.answer.split("|");
        pregunta.respuesta = [];
        for (const respuestaSeleccionada of respuestasSeleccionadas) {
          pregunta.respuesta.push(respuestaSeleccionada.trim());
        }
      } else {
        pregunta.respuesta = respuesta.answer;
      }
    }
  }
};

const show = (imagen) => {
  window.open(imagen, "_blank");
};

const sendComments = async (pregunta) => {
  const comments = { comments: pregunta.comments, rating: pregunta.rating };
  let res = await sendRequest(
    "PUT",
    comments,
    "/api/survey/answer/" + pregunta.respuesta_id,
    ""
  );
  getAnswers();
};

onMounted(() => {
  getAnswersfirst();
});
</script>


