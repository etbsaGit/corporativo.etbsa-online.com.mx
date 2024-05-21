<template>
  <q-table
    title="Encuesta"
    :rows="surveys"
    :columns="columns"
    row-key="id"
    :rows-per-page-options="[0]"
  >
    <template v-slot:body-cell-action="props">
      <q-td>
        <q-btn
          v-if="isSurveyActive(props.row)"
          flat
          round
          color="primary"
          icon="play_arrow"
          @click="onRowClick(props.row)"
        >
          <q-tooltip>Contestar encuesta</q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          color="primary"
          icon="search"
          @click="onRowClickDetail(props.row)"
        >
          <q-tooltip>Ver tus respuestas</q-tooltip>
        </q-btn>
      </q-td>
    </template>
    <template v-slot:body-cell-status="props">
      <q-td :props="props">
        <div v-if="props.row.status == 1">Activa</div>
        <div v-else>Inactiva</div>
      </q-td>
    </template>
    <template v-slot:body-cell-description="props">
      <q-td :props="props">
        {{
          props.row.description && props.row.description.length > 40
            ? props.row.description.slice(0, 40) + "..."
            : props.row.description
        }}
        <q-tooltip
          class="bg-purple text-body2"
          v-if="props.row.description && props.row.description.length > 40"
        >
          {{ props.row.description }}
        </q-tooltip>
      </q-td>
    </template>
  </q-table>

  <q-dialog
    v-model="showQuestions"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    :maximized="true"
  >
    <q-layout view="hHh Lpr fff">
      <q-header elevated class="bg-primary text-white" height-hint="98">
        <q-toolbar>
          <q-toolbar-title>
            Responde las preguntas de {{ selectedSurvey.title }}
          </q-toolbar-title>
          <q-card-actions align="right">
            <q-btn label="Cerrar" color="red" v-close-popup />
          </q-card-actions>
        </q-toolbar>
      </q-header>

      <q-page-container class="bg-white">
        <add-answers-form ref="answers" :survey="selectedSurvey" />
      </q-page-container>
    </q-layout>
  </q-dialog>

  <q-dialog
    v-model="showAnswers"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    :maximized="true"
  >
    <q-layout view="hHh Lpr fff">
      <q-header elevated class="bg-primary text-white" height-hint="98">
        <q-toolbar>
          <q-toolbar-title>
            Respuestas de {{ selectedSurvey.title }}
          </q-toolbar-title>
          <q-card-actions align="right">
            <q-btn label="Cerrar" color="red" v-close-popup />
          </q-card-actions>
        </q-toolbar>
      </q-header>

      <q-page-container class="bg-white">
        <show-answers-form ref="answers" :survey="selectedSurvey" />
      </q-page-container>
    </q-layout>
  </q-dialog>

  <!-- <q-dialog v-model="mostrarDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">¿Empezar prueba {{ selectedSurvey.title }}?</div>
        </q-card-section>

        <q-card-section>
          ¿Seguro que deseas empezar? solo tendras 2 horas para comenzar y si la pagina se actualiza o se cierra se tomara
          como terminada
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancelar" color="red" @click="mostrarDialog = false" />
          <q-btn label="Empezar" color="blue" @click="empezar()" />
        </q-card-actions>
      </q-card>
    </q-dialog> -->

  <!-- <q-dialog v-model="terminar" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">Enviar prueba {{ selectedSurvey.title }}</div>
        </q-card-section>

        <q-card-section>
          ¿Estas seguro de haber respondido todas las preguntas de manera correcta?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancelar" color="red" @click="terminar = false" />
          <q-btn label="Cerrar Evaluacion" color="blue" @click="sendAnswers()" />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
</template>

<script setup>
import { sendRequest } from "src/boot/functions";
import { ref, onMounted } from "vue";
import AddAnswersForm from "src/components/Survey/AddAnswersForm.vue";
import ShowAnswersForm from "src/components/Survey/ShowAnswersForm.vue";

const showQuestions = ref(false);
const showAnswers = ref(false);
const answers = ref(null);
const selectedSurvey = ref(null);
const surveys = ref([]);

const columns = [
  // { name: "id", label: "ID", align: "left", field: "id", sortable: true },
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
    field: (row) => formatDate(row.expire_date),
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getSurveys = async () => {
  let res = await sendRequest("GET", null, "/api/survey/user", "");
  surveys.value = res;
};

const isSurveyActive = (survey) => {
  // Si la encuesta no tiene una fecha de expiración o la fecha de expiración es posterior a la fecha actual,
  // y el estado es 1 (activo), la encuesta está activa
  return (
    (!survey.expire_date || new Date(survey.expire_date) > new Date()) &&
    survey.status === 1
  );
};

// Método para manejar el clic en el botón
const onRowClick = (row) => {
  if (!isSurveyActive(row)) {
    return;
  }

  // Aquí puedes manejar la lógica para abrir la encuesta
  showQuestions.value = true;
  selectedSurvey.value = row;
};

const onRowClickDetail = (row) => {
  showAnswers.value = true;
  selectedSurvey.value = row;
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
