<template>
  <q-form ref="myForm" greedy>
    <q-list bordered separator>
      <q-item v-for="pregunta in survey.question" :key="pregunta.id">
        <q-item-section>
          <q-item-label overline>
            <strong>Pregunta:</strong> {{ pregunta.question }}
          </q-item-label>
          <q-item-label caption>
            <strong>Descripcion:</strong>
            {{ pregunta.description }}</q-item-label
          >
          <q-img
            v-if="pregunta.imagen"
            :src="pregunta.imagen"
            style="height: 240px; max-width: 250px"
          >
            <q-btn
              class="all-pointer-events"
              size="10px"
              color="blue"
              icon="open_in_full"
              @click="show(pregunta.imagen)"
            >
              <q-tooltip> Ver en nueva pestaña </q-tooltip>
            </q-btn>
          </q-img>
          <q-input
            placeholder="Escribe tu respuesta"
            v-if="pregunta.type === 'textarea'"
            v-model="pregunta.respuesta"
            :disable="pregunta.respuestaAsignada"
            filled
            dense
          >
            <template v-slot:after>
              <q-btn
                v-if="pregunta.type !== 'hidden' && !pregunta.respuestaAsignada"
                color="primary"
                @click="enviarRespuesta(pregunta)"
                round
                dense
                flat
                icon="send"
                label="Enviar respuesta"
              />
            </template>
          </q-input>
          <q-input
            placeholder="Escribe tu respuesta"
            v-if="pregunta.type === 'text'"
            v-model="pregunta.respuesta"
            :disable="pregunta.respuestaAsignada"
            filled
            dense
          >
            <template v-slot:after>
              <q-btn
                v-if="pregunta.type !== 'hidden' && !pregunta.respuestaAsignada"
                color="primary"
                @click="enviarRespuesta(pregunta)"
                round
                dense
                flat
                icon="send"
                label="Enviar respuesta"
              />
            </template>
          </q-input>
          <div v-if="pregunta.type === 'select'">
            <q-select
              label="Selecciona una respuesta de la lista"
              v-model="pregunta.respuesta"
              :options="pregunta.data.map((item) => item.data)"
              :disable="pregunta.respuestaAsignada"
              filled
              dense
            >
              <template v-slot:after>
                <q-btn
                  v-if="
                    pregunta.type !== 'hidden' && !pregunta.respuestaAsignada
                  "
                  color="primary"
                  @click="enviarRespuesta(pregunta)"
                  round
                  dense
                  flat
                  icon="send"
                  label="Enviar respuesta"
                />
              </template>
            </q-select>
          </div>

          <div v-if="pregunta.type === 'radio'">
            <q-item-label caption>
              Selecciona la respuesta correcta
            </q-item-label>
            <q-item-section>
              <q-option-group
                v-model="pregunta.respuesta"
                :options="
                  pregunta.data.map((item) => ({
                    value: item.data,
                    label: item.data,
                  }))
                "
                :disable="pregunta.respuestaAsignada"
                inline
              />
            </q-item-section>
            <q-item-section>
              <q-btn
                class="q-ml-auto"
                v-if="pregunta.type !== 'hidden' && !pregunta.respuestaAsignada"
                color="primary"
                @click="enviarRespuesta(pregunta)"
                round
                dense
                flat
                icon="send"
                label="Enviar respuesta"
              />
            </q-item-section>
          </div>

          <div v-if="pregunta.type === 'checkbox'">
            <q-item-label caption>Selecciona una o mas respuestas</q-item-label>
            <q-item-section>
              <q-option-group
                v-model="pregunta.respuesta"
                :options="
                  pregunta.data.map((item) => ({
                    value: item.data,
                    label: item.data,
                  }))
                "
                :disable="pregunta.respuestaAsignada"
                inline
                type="checkbox"
              />
            </q-item-section>
            <q-item-section>
              <q-btn
                class="q-ml-auto"
                v-if="pregunta.type !== 'hidden' && !pregunta.respuestaAsignada"
                color="primary"
                @click="enviarRespuestaCheckbox(pregunta)"
                round
                dense
                flat
                icon="send"
                label="Enviar respuesta"
              />
            </q-item-section>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { sendRequest } from "src/boot/functions";

const { survey } = defineProps(["survey"]);
const myForm = ref(null);
const $q = useQuasar();

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

const formAnswer = ref({
  evaluee_id: survey.pivot.evaluee_id,
  question_id: null,
  answer: null,
});

const getAnswers = async () => {
  let res = await sendRequest(
    "GET",
    null,
    `/api/survey/answer/${survey.id}/${survey.pivot.evaluee_id}`,
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

const enviarRespuesta = async (pregunta) => {
  if (!pregunta.respuesta.trim()) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "La respuesta está vacía",
    });
    return;
  }

  (formAnswer.value.question_id = pregunta.id),
    (formAnswer.value.answer = pregunta.respuesta);

  let res = await sendRequest(
    "POST",
    formAnswer.value,
    "/api/survey/answer",
    ""
  );
  getAnswers();
};

const enviarRespuestaCheckbox = async (pregunta) => {
  if (pregunta.respuesta === 0) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "La respuesta está vacía",
    });
    return;
  }

  formAnswer.value.question_id = pregunta.id;
  formAnswer.value.answer = pregunta.respuesta.join("| ");

  let res = await sendRequest(
    "POST",
    formAnswer.value,
    "/api/survey/answer",
    ""
  );
  getAnswers();
};

const show = (imagen) => {
  window.open(imagen, "_blank");
};

const validate = async () => {
  return await myForm.value.validate();
};

onMounted(() => {
  getAnswers();
});

defineExpose({
  formAnswer,
  validate,
});
</script>

