<template>
  <q-form class="q-gutter-y-sm" ref="myForm" greedy>
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
        <q-input
          filled
          dense
          v-model="formSurvey.expire_date"
          mask="date"
          label="Cuando expira"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
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
        <div class="text-h6">
          <q-btn
            icon="delete"
            size="sm"
            color="red"
            label="Eliminar pregunta"
            filled
            dense
            @click="eliminarPregunta(index)"
          ></q-btn>
          Pregunta {{ index + 1 }}
        </div>
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
          :rules="[(val) => (val && val.length > 0) || 'Obligatorio']"
        />

        <q-img
          v-if="pregunta.base64"
          :src="pregunta.base64"
          style="height: 140px; max-width: 150px"
        />

        <q-file
          filled
          dense
          hint
          label="Imagenes"
          lazy-rules
          v-model="pregunta.file"
          @input="convertirBase64($event, index)"
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
                <template v-slot:before>
                  <q-btn
                    @click="eliminarOpcion(index, dataIndex)"
                    icon="delete"
                    size="sm"
                    color="red"
                    filled
                    dense
                    label="Eliminar opcion"
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
          label="Agrgear pregunta"
          @click="agregarPregunta"
        />
      </q-item-section>
    </q-item>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";
import { useAuthStore } from "src/stores/auth";
import { storeToRefs } from "pinia";

const auth = useAuthStore();
const { user } = storeToRefs(auth);
const myForm = ref(null);

const formSurvey = ref({
  title: null,
  status: false,
  description: null,
  expire_date: null,
  evaluator_id: user.value.id,
  questions: [],
});

const types = ["text", "select", "radio", "checkbox"];

const agregarPregunta = () => {
  formSurvey.value.questions.push({
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

const validate = async () => {
  return await myForm.value.validate();
};

defineExpose({
  formSurvey,
  validate,
});
</script>
