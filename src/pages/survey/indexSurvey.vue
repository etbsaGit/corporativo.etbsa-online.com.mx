<template>
  <q-item>
    <q-item-section>
      <q-table
        title="Evaluaciones"
        :rows="surveys"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[0]"
      >
        <template v-slot:top-right>
          <!-- v-if="isEncuestador == true" -->
          <q-btn
            dense
            color="primary"
            icon="add"
            label="Agregar Evaluacion"
            @click="showAdd = true"
          />
        </template>

        <template v-slot:body-cell-title="props">
          <q-td :props="props">
            <q-item-label>
              {{ props.row.title }}
            </q-item-label>
            <q-tooltip class="bg-purple text-body2" :offset="[10, 10]">
              {{ props.row.description }}
            </q-tooltip>
          </q-td>
        </template>

        <template v-slot:body-cell-puesto="props">
          <q-td :props="props">
            <q-item-label>
              {{ props.row.puesto ? props.row.puesto.nombre : null }}
            </q-item-label>
          </q-td>
        </template>

        <template v-slot:body-cell-action="props">
          <q-td>
            <q-btn-dropdown flat color="primary" icon="menu">
              <q-list v-close-popup>
                <q-item>
                  <q-btn
                    flat
                    size="sm"
                    color="primary"
                    icon="search"
                    label="Vista previa"
                    @click="onRowClickShow(props.row)"
                  />
                </q-item>
                <q-item>
                  <q-btn
                    flat
                    size="sm"
                    color="primary"
                    icon="edit"
                    label="Editar"
                    @click="onRowClick(props.row)"
                  />
                </q-item>
                <q-item>
                  <q-btn
                    flat
                    size="sm"
                    color="primary"
                    icon="copy_all"
                    label="Copiar"
                    @click="onRowClickClone(props.row)"
                  />
                </q-item>
                <q-item>
                  <q-btn
                    flat
                    size="sm"
                    color="primary"
                    icon="people"
                    label="Asignar"
                    @click="onRowClickAsing(props.row)"
                  />
                </q-item>
                <q-item>
                  <q-btn
                    flat
                    size="sm"
                    color="primary"
                    icon="quiz"
                    label="Calificar"
                    @click="onRowClickEvaluator(props.row)"
                  />
                </q-item>
                <q-item>
                  <q-btn
                    flat
                    size="sm"
                    color="primary"
                    icon="format_list_numbered"
                    label="Calificaciones"
                    @click="onRowClickGrades(props.row)"
                  />
                </q-item>
                <q-item v-if="checkRole('Admin')">
                  <q-btn
                    flat
                    size="sm"
                    color="red"
                    icon="delete"
                    label="Borrar"
                    @click="onRowClickDelete(props.row)"
                  />
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-btn
              round
              size="xs"
              icon="power_settings_new"
              :color="props.row.status == 1 ? 'green' : 'grey'"
              @click="changeStatus(props.row)"
            />
            <!-- <div v-if="props.row.status == 1">Activa</div>
              <div v-else>Inactiva</div> -->
          </q-td>
        </template>

        <template v-slot:body-cell-evaluee_count="props">
          <q-td @click="onRowClickEvaluee(props.row)">
            <q-btn flat>
              {{ props.row.evaluee_count }}
            </q-btn>
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
    </q-item-section>
  </q-item>

  <q-dialog
    v-model="showAdd"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    :maximized="true"
  >
    <q-layout view="hHh Lpr fff">
      <q-header elevated class="bg-primary text-white" height-hint="98">
        <q-toolbar>
          <q-toolbar-title> Registrar Evaluacion </q-toolbar-title>
          <q-card-actions align="right">
            <q-btn label="Cerrar" color="red" v-close-popup />
            <q-btn
              label="Agregar Evaluacion"
              color="blue"
              @click="addSurvey()"
            />
          </q-card-actions>
        </q-toolbar>
      </q-header>

      <q-page-container class="bg-white">
        <add-survey-form ref="add" />
      </q-page-container>
    </q-layout>
  </q-dialog>

  <q-dialog
    v-model="showDetails"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    :maximized="true"
  >
    <q-layout view="hHh Lpr fff">
      <q-header elevated class="bg-primary text-white" height-hint="98">
        <q-toolbar>
          <q-toolbar-title>
            Actualizar Evaluacion {{ selectedSurvey.title }}
          </q-toolbar-title>
          <q-card-actions align="right">
            <q-btn label="Cerrar" color="red" v-close-popup />
            <q-btn
              label="Actualizar Evaluacion"
              color="blue"
              @click="editSurvey()"
            />
          </q-card-actions>
        </q-toolbar>
      </q-header>

      <q-page-container class="bg-white">
        <edit-survey-form
          ref="edit"
          :survey="selectedSurvey"
          :key="selectedSurvey.base64"
        />
      </q-page-container>
    </q-layout>
  </q-dialog>

  <q-dialog
    v-model="showEmployees"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-height
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">
            Asignar {{ selectedSurvey.title }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Asignar" color="blue" @click="evalueeSurvey()" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <add-evaluees-form ref="evaluees" :survey="selectedSurvey" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <!-- <q-dialog
    v-model="showEvaluator"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    :maximized="true"
  >
    <q-layout view="hHh Lpr fff">
      <q-header elevated class="bg-primary text-white" height-hint="98">
        <q-toolbar>
          <q-toolbar-title>
            Calificar {{ selectedSurvey.title }}
          </q-toolbar-title>
          <q-card-actions align="right">
            <q-btn label="Cerrar" color="red" v-close-popup />
          </q-card-actions>
        </q-toolbar>
      </q-header>

      <q-page-container class="bg-white">
        <add-comment-form ref="evaluator" :survey="selectedSurvey" />
      </q-page-container>
    </q-layout>
  </q-dialog> -->

  <q-dialog
    v-model="showEvaluator"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">
            Calificar {{ selectedSurvey.title }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <add-comment-form ref="evaluator" :survey="selectedSurvey" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showPreview"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    :maximized="true"
  >
    <q-layout view="hHh Lpr fff">
      <q-header elevated class="bg-primary text-white" height-hint="98">
        <q-toolbar>
          <q-toolbar-title>
            Vista previa {{ selectedSurvey.title }}
          </q-toolbar-title>
          <q-card-actions align="right">
            <q-btn label="Cerrar" color="red" v-close-popup />
          </q-card-actions>
        </q-toolbar>
      </q-header>

      <q-page-container class="bg-white">
        <show-survey-form ref="evaluator" :survey="selectedSurvey" />
      </q-page-container>
    </q-layout>
  </q-dialog>

  <q-dialog
    v-model="showGrades"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    :maximized="true"
  >
    <q-layout view="hHh Lpr fff">
      <q-header elevated class="bg-primary text-white" height-hint="98">
        <q-toolbar>
          <q-toolbar-title>
            Calificaciones {{ selectedSurvey.title }}
          </q-toolbar-title>
          <q-card-actions align="right">
            <q-btn label="Cerrar" color="red" v-close-popup />
          </q-card-actions>
        </q-toolbar>
      </q-header>

      <q-page-container class="bg-white">
        <show-grades-form ref="grades" :survey="selectedSurvey" />
      </q-page-container>
    </q-layout>
  </q-dialog>

  <q-dialog
    v-model="showClone"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    :maximized="true"
  >
    <q-layout view="hHh Lpr fff">
      <q-header elevated class="bg-primary text-white" height-hint="98">
        <q-toolbar>
          <q-toolbar-title>
            Clonar Evaluacion {{ selectedSurvey.title }}
          </q-toolbar-title>
          <q-card-actions align="right">
            <q-btn label="Cerrar" color="red" v-close-popup />
            <q-btn
              label="Clonar Evaluacion"
              color="blue"
              @click="addSurvey()"
              v-close-popup
            />
          </q-card-actions>
        </q-toolbar>
      </q-header>

      <q-page-container class="bg-white">
        <edit-survey-form
          ref="add"
          :survey="selectedSurvey"
          :key="selectedSurvey.base64"
        />
      </q-page-container>
    </q-layout>
  </q-dialog>

  <q-dialog
    v-model="showDelete"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-card-section class="d-flex justify-between items-center q-pa-sm">
        <div class="text-h6">
          ¿Deseas borrar {{ selectedSurvey.title }} y todo las preguntas y
          respuestas relacionadas?
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          label="Eliminar"
          color="orange"
          @click="deleteSurvey"
          v-close-popup
        />
        <q-btn label="Cerrar" color="red" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEvaluee"
    transition-show="rotate"
    transition-hide="rotate"
  >
    <q-card style="width: 400px">
      <q-card-section class="d-flex justify-between items-center q-pa-sm">
        <div class="text-h6">Evaluados</div>
        <q-card-actions align="right">
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-card-actions>
      </q-card-section>
      <q-separator />
      <div class="survey-form-container">
        <show-evaluees-form :survey="selectedSurvey" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, checkRole } from "src/boot/functions";
import AddSurveyForm from "src/components/Survey/AddSurveyForm.vue";
import EditSurveyForm from "src/components/Survey/EditSurveyForm.vue";
import ShowSurveyForm from "src/components/Survey/ShowSurveyForm.vue";
import AddEvalueesForm from "src/components/Survey/AddEvalueesForm.vue";
import AddCommentForm from "src/components/Survey/AddCommentForm.vue";
import ShowGradesForm from "src/components/Survey/ShowGradesForm.vue";
import ShowEvalueesForm from "src/components/Survey/ShowEvalueesForm.vue";
import { useQuasar } from "quasar";
import { inject } from "vue";

const bus = inject("bus");

const surveys = ref([]);
const selectedSurvey = ref(null);
const showAdd = ref(false);
const showDetails = ref(false);
const showEmployees = ref(false);
const showEvaluator = ref(false);
const showPreview = ref(false);
const showGrades = ref(false);
const showClone = ref(false);
const showDelete = ref(false);
const showEvaluee = ref(false);
const add = ref(null);
const edit = ref(null);
const evaluees = ref(null);
const evaluator = ref(null);
const grades = ref(null);
const $q = useQuasar();

const columns = [
  //{ name: "id", label: "ID", align: "left", field: "id", sortable: true },
  {
    name: "status",
    label: "Status",
    align: "left",
    field: "status",
    sortable: true,
  },
  {
    name: "title",
    label: "Titulo",
    align: "left",
    field: "title",
    sortable: true,
  },
  // {
  //   name: "description",
  //   label: "Descripcion",
  //   align: "left",
  //   field: "description",
  //   sortable: true,
  // },
  {
    name: "puesto",
    label: "Puesto",
    align: "left",
    field: "puesto",
    sortable: true,
  },
  {
    name: "evaluee_count",
    label: "Evaluados",
    align: "left",
    field: "evaluee_count",
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

bus.on("imagen-borrada", () => {
  getSurveys();
});

const onRowClick = (row) => {
  selectedSurvey.value = row;
  showDetails.value = true;
};

const onRowClickShow = (row) => {
  selectedSurvey.value = row;
  showPreview.value = true;
};

const onRowClickAsing = (row) => {
  selectedSurvey.value = row;
  showEmployees.value = true;
};

const onRowClickEvaluator = (row) => {
  selectedSurvey.value = row;
  showEvaluator.value = true;
};

const onRowClickGrades = (row) => {
  selectedSurvey.value = row;
  showGrades.value = true;
};

const onRowClickClone = (row) => {
  selectedSurvey.value = row;
  showClone.value = true;
};

const onRowClickDelete = (row) => {
  selectedSurvey.value = row;
  showDelete.value = true;
};

const onRowClickEvaluee = (row) => {
  selectedSurvey.value = row;
  showEvaluee.value = true;
};

const changeStatus = async (row) => {
  let res = await sendRequest("PUT", null, "/api/survey/status/" + row.id, "");
  getSurveys();
};

const deleteSurvey = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/survey/" + selectedSurvey.value.id,
    ""
  );
  showDelete.value = false;
  getSurveys();
};

const getSurveys = async () => {
  if (checkRole("Evaluador")) {
    let res = await sendRequest("GET", null, "/api/survey/evaluator", "");
    surveys.value = res;
  }
  if (checkRole("Encuestador") || checkRole("Admin")) {
    let res = await sendRequest("GET", null, "/api/survey", "");
    surveys.value = res;
  }
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
  const survey = ref(selectedSurvey.value.id);
  let res = await sendRequest(
    "POST",
    final,
    "/api/surveys/evaluees/" + survey.value,
    ""
  );
  showEmployees.value = false;
  getSurveys();
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
