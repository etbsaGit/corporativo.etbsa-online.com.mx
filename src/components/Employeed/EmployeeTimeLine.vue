<template>
  <div class="q-px-lg q-py-md">
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
import { ref, inject, onMounted } from "vue";
import { sendRequest } from "src/boot/functions";

const { empleado, editable } = defineProps(["empleado", "editable"]);
const bus = inject("bus");

const selectedRowIndex = ref(null);
const preEdit = ref(null);
const careers = ref([]);

// Objeto para almacenar los cambios en los campos de edición
const formCareer = ref({
  title: null,
  date: null,
  description: null,
  id: null,
});

const onRowClick = (index) => {
  if (editable == true) {
    selectedRowIndex.value = index;
  }
};

bus.on("career", () => {
  getCareers();
  preEdit.value = null;
});

const onRowClickDelete = async (row) => {
  let res = await sendRequest("DELETE", null, "/api/career/" + row, "");
  selectedRowIndex.value = null;
  getCareers();
};

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
  getCareers();
  selectedRowIndex.value = null;
  preEdit.value = null; // Desactivamos la edición
};

const cancelEdit = () => {
  selectedRowIndex.value = null;
  preEdit.value = null;
};

onMounted(() => {
  getCareers();
});
</script>



