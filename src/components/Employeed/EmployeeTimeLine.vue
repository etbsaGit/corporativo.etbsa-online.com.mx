<template>
  <div class="q-pa-sm">
    <q-btn
      icon="add"
      size="sm"
      dense
      v-if="editable == true && inputsEnabled == false"
      label="agregar"
      color="blue"
      @click="enableInputs"
    />
    <div v-if="inputsEnabled == true">
      <q-item>
        <q-item-section>
          <q-input filled dense v-model="formCareer.title" label="Titulo" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input
            filled
            dense
            v-model="formCareer.date"
            mask="date"
            label="Fecha de entrada"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="formCareer.date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
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
          <q-input
            filled
            dense
            v-model="formCareer.description"
            label="Descripcion"
          />
        </q-item-section>
      </q-item>
      <q-item>
        <q-btn
          size="sm"
          dense
          label="Cancelar"
          color="red"
          @click="inputsEnabled = false"
        />
        <q-btn
          dense
          size="sm"
          label="Agregar"
          color="green"
          @click="saveCareer"
        />
      </q-item>
    </div>
    <q-timeline color="secondary" v-if="careers">
      <q-timeline-entry
        v-for="(career, index) in careers"
        :key="index"
        icon="calendar_today"
        @click="onRowClick(index)"
      >
        <template v-slot:subtitle>
          <template v-if="selectedRowIndex !== index || preEdit !== index">
            <span>{{ career.date }}</span>
          </template>
          <template v-else>
            <q-input
              filled
              dense
              v-model="formCareer.date"
              mask="date"
              label="Fecha de entrada"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="formCareer.date">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </template>
        </template>
        <template v-slot:title>
          <template v-if="selectedRowIndex !== index || preEdit !== index">
            <span>{{ career.title }}</span>
          </template>
          <template v-else>
            <q-input label="Titulo" filled dense v-model="formCareer.title" />
          </template>
        </template>
        <template v-if="selectedRowIndex !== index || preEdit !== index">
          <span>{{ career.description }}</span>
        </template>
        <template v-else>
          <q-input
            label="Descripcion"
            filled
            dense
            v-model="formCareer.description"
          />
        </template>
        <div v-if="selectedRowIndex === index && preEdit !== index">
          <q-btn
            icon="delete"
            dense
            color="red"
            @click="onRowClickDelete(career.id)"
          />
          <q-btn
            icon="edit"
            dense
            color="green"
            @click="onRowClickEdit(index)"
          />
        </div>
        <div v-if="selectedRowIndex === index && preEdit === index">
          <q-btn
            size="sm"
            label="Cancelar"
            dense
            color="negative"
            @click="cancelEdit"
          />
          <q-btn
            size="sm"
            label="Guardar"
            dense
            color="blue"
            @click="saveChanges(career.id)"
          />
        </div>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { empleado, editable } = defineProps(["empleado", "editable"]);

const selectedRowIndex = ref(null);
const preEdit = ref(null);
const careers = ref([]);
const inputsEnabled = ref(false);

// Objeto para almacenar los cambios en los campos de edición
const formCareer = ref({
  title: null,
  date: null,
  description: null,
  id: null,
  empleado_id: empleado.id,
});

const onRowClick = (index) => {
  if (editable == true) {
    selectedRowIndex.value = index;
  }
};

const enableInputs = () => {
  inputsEnabled.value = true;
  preEdit.value = null;
  selectedRowIndex.value = null;
  formCareer.value.title = null;
  formCareer.value.date = null;
  formCareer.value.description = null;
};

const saveCareer = async () => {
  let res = await sendRequest("POST", formCareer.value, "/api/career", "");
  inputsEnabled.value = false;
  formCareer.value.title = null;
  formCareer.value.date = null;
  formCareer.value.description = null;
  getCareers();
};

async function onRowClickDelete(row) {
  let res = await sendRequest("DELETE", null, "/api/career/" + row, "");
  selectedRowIndex.value = null;
  getCareers();
}

const getCareers = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/career/empleados/new/" + empleado.id,
    ""
  );
  careers.value = res;
};

const onRowClickEdit = async (index) => {
  preEdit.value = index;
  inputsEnabled.value = false;
  // Establecemos los valores iniciales del formulario de edición
  formCareer.value.title = careers.value[index].title;
  formCareer.value.date = careers.value[index].date;
  formCareer.value.description = careers.value[index].description;
  formCareer.value.id = careers.value[index].id;
};

const saveChanges = async (id) => {
  let res = await sendRequest(
    "PUT",
    formCareer.value,
    "/api/career/" + formCareer.value.id,
    ""
  );
  selectedRowIndex.value = null;
  preEdit.value = null; // Desactivamos la edición
  formCareer.value.title = null;
  formCareer.value.date = null;
  formCareer.value.description = null;
  getCareers();
};

const cancelEdit = () => {
  selectedRowIndex.value = null;
  preEdit.value = null;
  formCareer.value.title = null;
  formCareer.value.date = null;
  formCareer.value.description = null;
};

onMounted(() => {
  getCareers();
});
</script>



