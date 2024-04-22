<template>
  <q-form ref="myForm" greedy>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formSurvey.title"
          filled
          dense
          label="Titulo"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          v-model="formSurvey.description"
          filled
          dense
          hint
          label="Descripcion"
          lazy-rules
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-select
          :disable="checkRole('Encuestador') == false"
          v-model="formSurvey.evaluator_id"
          :options="evaluators"
          option-value="id"
          option-label="email"
          label="Encuestador"
          option-disable="inactive"
          emit-value
          map-options
          transition-show="jump-up"
          transition-hide="jump-up"
          clearable
          filled
          dense
          hint
        />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input
          filled
          dense
          v-model="formSurvey.expire_date"
          mask="date"
          label="Cuando expira"
          lazy-rules
          hint="Si no tiene fecha de expiracion dejar en blanco"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="formSurvey.expire_date">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="gray" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-checkbox
          size="xl"
          v-model="formSurvey.status"
          val="xl"
          label="Activa"
          :true-value="1"
          :false-value="0"
        />
      </q-item-section>
    </q-item>
    <q-separator />
    <q-item>
      <q-item-section>
        <div class="text-h6">Preguntas</div>
      </q-item-section>
    </q-item>
    <q-separator />
    <q-item v-for="(pregunta, index) in formSurvey.questions" :key="index">
      <q-item-section>
        <q-card-section class="d-flex justify-between items-center q-pa-sm">
          <div class="text-h6">Pregunta {{ index + 1 }}</div>
          <q-card-actions align="right">
            <q-btn
              align="left"
              icon="delete"
              size="sm"
              color="red"
              label="Eliminar pregunta"
              filled
              dense
              @click="eliminarPregunta(index)"
            />
          </q-card-actions>
        </q-card-section>
        <br />
        <q-input
          v-model="pregunta.question"
          filled
          dense
          hint
          label="Pregunta"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />
        <q-input
          v-model="pregunta.description"
          filled
          dense
          hint
          label="Descripcion"
          lazy-rules
        />

        <q-img
          v-if="pregunta.imagen || pregunta.base64"
          :src="pregunta.base64 ? pregunta.base64 : pregunta.imagen"
          style="height: 240px; max-width: 250px"
        >
          <q-btn
            class="all-pointer-events"
            size="10px"
            color="red"
            icon="delete"
            @click="deleteImage(pregunta.id, index)"
          >
            <q-tooltip> Borrar imagen </q-tooltip>
          </q-btn>
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

        <q-file
          filled
          dense
          hint
          label="Imagenes"
          lazy-rules
          v-model="pregunta.file"
          @input="convertirBase64($event, index)"
        />

        <q-select
          v-model="pregunta.type"
          :options="types"
          label="tipo de respuesta"
          transition-show="jump-up"
          transition-hide="jump-up"
          clearable
          filled
          dense
          hint
          emit-value
          map-options
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />

        <div
          v-if="
            pregunta.type === 'select' ||
            pregunta.type === 'checkbox' ||
            pregunta.type === 'radio'
          "
        >
          <q-item>
            <q-item-section>
              <div class="text-h6">Opciones pregunta {{ index + 1 }}</div>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item v-for="(data, dataIndex) in pregunta.data" :key="dataIndex">
            <q-item-section>
              <q-input
                v-model="data.data"
                placeholder="Opcion"
                filled
                dense
                hint
                :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
              >
                <template v-slot:after>
                  <q-btn
                    @click="eliminarOpcion(index, dataIndex)"
                    icon="delete"
                    size="sm"
                    color="red"
                    label="Eliminar opcion"
                    filled
                    dense
                  />
                </template>
              </q-input>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-btn
                color="primary"
                icon="add"
                label="Agregar opciones"
                @click="agregarOpcion(index)"
              />
            </q-item-section>
          </q-item>
        </div>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-btn
          color="primary"
          icon="add"
          label="Agregar pregunta"
          @click="agregarPregunta"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, checkRole } from "src/boot/functions";
import { v4 as uuidv4 } from "uuid";
import { inject } from "vue";

const bus = inject("bus");
const { survey } = defineProps(["survey"]);
const myForm = ref(null);
const evaluators = ref([]);

const formSurvey = ref({
  id: survey.id,
  title: survey.title,
  status: survey.status,
  description: survey.description,
  expire_date: survey.expire_date,
  evaluator_id: survey.evaluator_id,
  questions: survey.question,
});

const types = [
  { label: "Respuesta abierta", value: "text" },
  { label: "Lista de muchas opciones una sola respuesta", value: "select" },
  { label: "Boton una sola respuesta", value: "radio" },
  { label: "Casillas multiples respuestas", value: "checkbox" },
];

const agregarPregunta = () => {
  formSurvey.value.questions.push({
    id: uuidv4(),
    question: null,
    descripcion: null,
    base64: null,
    type: null,
    data: [],
    file: [],
  });
};

const convertirBase64 = (event, index) => {
  const archivo = event.target.files[0];
  if (archivo) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      // Asignar el valor base64 al campo 'image' de la pregunta específica
      formSurvey.value.questions[index].base64 = base64Data;
    };
    reader.readAsDataURL(archivo);
  }
};

const eliminarPregunta = (index) => {
  formSurvey.value.questions.splice(index, 1);
};

const agregarOpcion = (index) => {
  formSurvey.value.questions[index].data.push({ data: "" });
};

const eliminarOpcion = (preguntaIndex, opcionIndex) => {
  formSurvey.value.questions[preguntaIndex].data.splice(opcionIndex, 1);
};

const show = (imagen) => {
  window.open(imagen, "_blank");
};

const deleteImage = async (idImage, preguntaIndex) => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/survey/question/image/" + idImage,
    ""
  );
  if (res.success) {
    formSurvey.value.questions[preguntaIndex].imagen = null;
    formSurvey.value.questions[preguntaIndex].image = null;
    formSurvey.value.questions[preguntaIndex].base64 = null;
    bus.emit("imagen-borrada");
  } else {
    console.error("Error al eliminar la imagen.");
  }
};

const validate = async () => {
  return await myForm.value.validate();
};

const getEvaluators = async () => {
  let res = await sendRequest("GET", null, "/api/user/all", "");
  evaluators.value = res;
};

onMounted(() => {
  getEvaluators();
  for (const pregunta of formSurvey.value.questions) {
    if (pregunta.data) {
      try {
        pregunta.data = JSON.parse(pregunta.data);
      } catch (error) {
        return;
      }
    }
  }
});

defineExpose({
  formSurvey,
  validate,
});
</script>
