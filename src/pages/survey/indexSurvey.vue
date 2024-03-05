<template>
  <div class="q-pa-md">
    <q-table
      title="Encuesta"
      :rows="surveys"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:top-left>
        <q-btn
          color="primary"
          icon="add"
          label="Agregar encuesta"
          @click="showAdd = true"
        />
      </template>

      <template v-slot:body-cell-action="props">
        <q-td>
          <q-btn
            flat
            round
            color="primary"
            icon="menu"
            @click="onRowClick(props.row)"
          />
          <q-btn
            flat
            round
            color="primary"
            icon="people"
            @click="onRowClickAsing(props.row)"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div v-if="props.row.status == 1">Activa</div>
          <div v-else>Inactiva</div>
        </q-td>
      </template>
    </q-table>

    <q-dialog
      v-model="showAdd"
      transition-show="rotate"
      transition-hide="rotate"
      persistent
      full-width
      full-height
    >
      <q-card>
        <q-card-section class="d-flex justify-between items-center">
          <div class="text-h6">Registrar Encuesta</div>
          <q-card-actions align="right">
            <q-btn label="X" color="red" v-close-popup dense />
          </q-card-actions>
        </q-card-section>
        <q-separator />
        <q-card class="q-pa-none scroll" flat>
          <div class="survey-form-container">
            <add-survey-form ref="add" />
          </div>
        </q-card>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="red" v-close-popup />
          <q-btn label="Agregar encuesta" color="blue" @click="addSurvey()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showDetails"
      transition-show="rotate"
      transition-hide="rotate"
      persistent
      full-width
      full-height=""
    >
      <q-card>
        <q-card-section class="d-flex justify-between items-center">
          <div class="text-h6">Actualizar Encuesta</div>
          <q-card-actions align="right">
            <q-btn label="X" color="red" v-close-popup dense />
          </q-card-actions>
        </q-card-section>
        <q-separator />
        <q-card class="q-pa-none scroll" flat>
          <div class="survey-form-container">
            <edit-survey-form ref="edit" :survey="selectedSurvey" />
          </div>
        </q-card>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="red" v-close-popup />
          <q-btn
            label="Actualizar encuesta"
            color="blue"
            @click="editSurvey()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showEmployees"
      transition-show="rotate"
      transition-hide="rotate"
      persistent
      full-width
      full-height
    >
      <q-card>
        <q-card-section class="d-flex justify-between items-center">
          <div class="text-h6">Asignar encuesta {{ selectedSurvey.title }}</div>
          <q-card-actions align="right">
            <q-btn label="X" color="red" v-close-popup dense />
          </q-card-actions>
        </q-card-section>
        <q-separator />
        <q-card class="q-pa-none scroll" flat>
          <add-evaluees-form ref="evaluees" :survey="selectedSurvey" />
        </q-card>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="red" v-close-popup />
          <q-btn
            label="Asignar encuesta encuesta"
            color="blue"
            @click="evalueeSurvey()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import { sendRequest } from "src/boot/functions";
import { api } from "src/boot/axios";
import AddSurveyForm from "src/components/Survey/AddSurveyForm.vue";
import EditSurveyForm from "src/components/Survey/EditSurveyForm.vue";
import AddEvalueesForm from "src/components/Survey/AddEvalueesForm.vue";
import { useQuasar } from "quasar";

const filter = ref("");
const surveys = ref([]);
const selectedSurvey = ref(null);
const showAdd = ref(false);
const showDetails = ref(false);
const showEmployees = ref(false);
const add = ref(null);
const edit = ref(null);
const evaluees = ref(null);
const $q = useQuasar();

const columns = [
  { name: "id", label: "ID", align: "left", field: "id", sortable: true },
  {
    name: "title",
    label: "Titulo",
    align: "left",
    field: "title",
    sortable: true,
  },
  {
    name: "status",
    label: "Status",
    align: "left",
    field: "status",
    sortable: true,
  },
  {
    name: "description",
    label: "Descripcion",
    align: "left",
    field: "description",
    sortable: true,
  },
  {
    name: "expire_date",
    label: "Fecha de expiracion",
    align: "left",
    field: "expire_date",
    sortable: true,
  },
  {
    name: "action",
    label: "Action",
    align: "left",
    field: "action",
    sortable: true,
  },
];

const onRowClick = (row) => {
  selectedSurvey.value = row;
  showDetails.value = true;
};

const onRowClickAsing = (row) => {
  selectedSurvey.value = row;
  showEmployees.value = true;
};

const getSurveys = async () => {
  let res = await sendRequest("GET", null, "/api/survey", "");
  surveys.value = res;
};

const addSurvey = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...add.value.formSurvey,
  };
  console.log(final);
  let res = await sendRequest("POST", final, "/api/survey", "");
  showAdd.value = false;
  getSurveys();
};

const editSurvey = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Por favor completa todos los campos obligatorios",
    });
    return;
  }
  const final = {
    ...edit.value.formSurvey,
  };
  let res = await sendRequest("PUT", final, "/api/survey/" + final.id, "");
  showDetails.value = false;
  getSurveys();
};

const evalueeSurvey = async () => {
  const final = {
    evaluees: evaluees.value.selectedEvaluee,
  };
  // try {
  //   let res = await sendRequest("POST", final, "/surveys/evaluees/" + selectedSurvey.value.id, "");
  //   showEmployees.value = false;
  //   getSurveys();
  // } catch (error) {
  //   console.error("Error al enviar la solicitud:", error);
  // }
  try {
    let res = await api.post(
      `/surveys/evaluees/${selectedSurvey.value.id}`,
      final,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    showEmployees.value = false;
    getSurveys();
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
};

onMounted(() => {
  getSurveys();
});
</script>

<style>
.d-flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.survey-form-container {
  max-height: 600px; /* Ajusta este valor según tus necesidades */
  overflow-y: auto;
}
</style>
