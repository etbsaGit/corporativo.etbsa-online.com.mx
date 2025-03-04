<template>
  <q-expansion-item
    dense
    flat
    color="primary"
    icon="menu"
    label="Opciones"
    v-if="checkRole('RRHH')"
  >
    <q-separator />
    <q-expansion-item
      dense
      flat
      icon="arrow_right_alt"
      color="primary"
      label="Activos"
    >
      <q-item>
        <q-item-section>
          <q-item-label class="text-h6 text-grey-8" align="center">
            -Activos-
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input
            outlined
            dense
            label="Buscar empleado"
            v-model="filterForm.search"
            @update:model-value="onInputChange"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-item-section>
        <q-item-section side>
          <q-btn
            dense
            label="Agregar empleado"
            color="primary"
            @click="showAdd = true"
            icon="add_circle"
          />
        </q-item-section>
        <q-item-section side>
          <q-btn dense color="primary" @click="onRowClickExcel" icon="download">
            <q-tooltip
              anchor="center left"
              self="center right"
              :offset="[10, 10]"
              class="text-h6"
            >
              Descargar xlsx de los empleados filtrados
            </q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select
            v-model="filterForm.sucursal_id"
            :options="sucursales"
            label="Sucursal"
            option-value="id"
            option-label="nombre"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            clearable
            outlined
            dense
            @update:model-value="onInputChange"
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.linea_id"
            :options="lineas"
            label="Linea"
            option-value="id"
            option-label="nombre"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            clearable
            outlined
            dense
            @update:model-value="onInputChange"
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.departamento_id"
            :options="departamentos"
            label="Departamentos"
            option-value="id"
            option-label="nombre"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            clearable
            outlined
            dense
            @update:model-value="onInputChange"
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.puesto_id"
            :options="puestos"
            label="Puesto"
            option-value="id"
            option-label="nombre"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            clearable
            outlined
            dense
            @update:model-value="onInputChange"
          />
        </q-item-section>
      </q-item>
    </q-expansion-item>
    <q-separator />

    <q-expansion-item
      dense
      flat
      icon="arrow_right_alt"
      color="primary"
      label="Altas"
    >
      <q-item>
        <q-item-section>
          <q-item-label class="text-h6 text-grey-8" align="center">
            -Altas-
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select
            v-model="mes"
            :options="months"
            label="Mes"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            clearable
            outlined
            dense
          />
        </q-item-section>

        <q-item-section>
          <q-select
            v-model="anio"
            :options="years"
            label="Año"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            clearable
            outlined
            dense
          />
        </q-item-section>
        <q-item-section side>
          <q-btn
            icon="search"
            label="Buscar Altas"
            color="primary"
            @click="getKardexNew(mes, anio)"
          />
        </q-item-section>
      </q-item>
    </q-expansion-item>
    <q-separator />

    <q-expansion-item
      dense
      flat
      icon="arrow_right_alt"
      color="primary"
      label="Bajas"
    >
      <q-item>
        <q-item-section>
          <q-item-label class="text-h6 text-grey-8" align="center">
            -Bajas-
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-select
            v-model="mes"
            :options="months"
            label="Mes"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            clearable
            outlined
            dense
          />
        </q-item-section>

        <q-item-section>
          <q-select
            v-model="anio"
            :options="years"
            label="Año"
            option-value="id"
            option-label="name"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            clearable
            outlined
            dense
          />
        </q-item-section>
        <q-item-section side>
          <q-btn
            icon="search"
            label="Buscar bajas"
            color="primary"
            @click="getKardex(mes, anio)"
          />
        </q-item-section>
      </q-item>
    </q-expansion-item>
    <q-separator />

    <q-expansion-item
      dense
      flat
      icon="arrow_right_alt"
      color="primary"
      label="Vacaciones"
    >
      <q-item>
        <q-item-section>
          <q-item-label class="text-h6 text-grey-8" align="center">
            -Vacaciones-
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-input
            outlined
            readonly
            dense
            v-model="dates.from"
            mask="date"
            label="Del:"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="dates.from" minimal />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item-section>
        <q-item-section>
          <q-input
            outlined
            readonly
            dense
            v-model="dates.to"
            mask="date"
            label="Al:"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="dates.to" minimal />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item-section>
        <q-item-section side>
          <q-btn
            label="Buscar empleados"
            color="primary"
            @click="getVacations"
          />
        </q-item-section>
        <q-item-section side>
          <q-btn
            dense
            color="primary"
            @click="onRowClickExcelVacation"
            icon="download"
          >
            <q-tooltip
              anchor="center left"
              self="center right"
              :offset="[10, 10]"
              class="text-h6"
            >
              Descargar xlsx de los empleados de vacaciones
            </q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
    </q-expansion-item>
  </q-expansion-item>
  <!-- - -->

  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        title="Empleados"
        :rows="rows"
        :columns="columns"
        row-key="name"
        dense
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-id="props">
          <q-td>
            <q-item class="q-my-none" dense>
              <q-item-section avatar>
                <q-avatar
                  color="primary"
                  text-color="white"
                  v-if="props.row.picture"
                >
                  <img :src="props.row.picture" alt="Foto del empleado" />
                </q-avatar>
                <q-avatar v-else color="primary" text-color="white">
                  {{ props.row.nombre.charAt(0).toUpperCase()
                  }}{{ props.row.apellido_paterno.charAt(0).toUpperCase() }}
                </q-avatar>
              </q-item-section>
            </q-item>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td>
            <q-btn-dropdown dense flat color="primary" icon="menu">
              <q-list v-close-popup>
                <q-item>
                  <q-btn
                    color="primary"
                    @click="onRowClickCV(props.row)"
                    flat
                    size="sm"
                    label="Perfil"
                    icon="face"
                  />
                </q-item>
                <q-item v-if="checkRole('RRHH')">
                  <q-btn
                    color="primary"
                    @click="openEdit(props.row)"
                    flat
                    size="sm"
                    label="Editar"
                    icon="edit"
                  />
                </q-item>
                <q-item v-if="checkRole('RRHH')">
                  <q-btn
                    color="primary"
                    @click="onRowClickFile(props.row)"
                    flat
                    size="sm"
                    label="Expediente"
                    icon="folder"
                  />
                </q-item>
                <q-item>
                  <q-btn
                    color="primary"
                    @click="onRowClickSkill(props.row)"
                    flat
                    size="sm"
                    label="Skill"
                    icon="analytics"
                  />
                </q-item>
                <q-item>
                  <q-btn
                    color="primary"
                    @click="openCareerDialog(props.row)"
                    flat
                    size="sm"
                    label="Carreras"
                    icon="work"
                  />
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
        </template>
        <template v-slot:body-cell-estatus="props">
          <q-td :props="props">
            <q-badge
              text-color="black"
              :style="{ backgroundColor: props.row.estatus.color }"
            >
              <div class="text-subtitle1">
                {{ props.row.estatus.nombre }}
              </div>
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-puesto="props">
          <q-td :props="props">
            {{ props.row.puesto.nombre }}
          </q-td>
        </template>
        <template v-slot:body-cell-sucursal="props">
          <q-td :props="props">
            {{ props.row.sucursal.nombre }}
          </q-td>
        </template>
        <template v-slot:body-cell-linea="props">
          <q-td :props="props">
            {{ props.row.linea.nombre }}
          </q-td>
        </template>
        <template v-slot:body-cell-departamento="props">
          <q-td :props="props">
            {{ props.row.departamento.nombre }}
          </q-td>
        </template>

        <template v-slot:top-right>
          <!-- <q-btn outline dense color="primary" @click="getRows" icon="refresh">
            <q-tooltip
              anchor="center left"
              self="center right"
              :offset="[10, 10]"
              class="text-h6"
            >
              Cargar a todos los empleados activos
            </q-tooltip>
          </q-btn> -->
          <q-btn outline dense color="primary" @click="getRows" icon="refresh">
            <q-tooltip
              anchor="center left"
              self="center right"
              :offset="[10, 10]"
              class="text-h6"
            >
              Cargar a todos los empleados
            </q-tooltip>
          </q-btn>
        </template>

        <template v-slot:bottom>
          <q-space />
          <td>
            <q-pagination
              color="primary"
              v-model="current_page"
              :max="last_page"
              :max-pages="6"
              direction-links
              boundary-links
              gutter="10px"
              icon-first="skip_previous"
              icon-last="skip_next"
              icon-prev="fast_rewind"
              icon-next="fast_forward"
            />
          </td>
          <q-space />
        </template>
      </q-table>
    </q-item-section>
  </q-item>

  <q-dialog
    v-model="showAdd"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Registrar empleado</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Agregar" color="blue" @click="postRow" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <employee-form ref="add" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEdit"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Actualizar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Actualizar" color="blue" @click="putRow" />
        </q-item-section>
        <!-- <q-item-section side>
          <q-btn label="Borrar" color="orange" @click="deleteRow" />
        </q-item-section> -->
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <employee-form ref="edit" :empleado="selectedRow" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showFiles"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">
            Expediente de {{ selectedRow.nombreCompleto }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <employeed-three-form ref="edit_3" :empleado="selectedRow" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showSkill"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">
            Skill de {{ selectedRow.nombreCompleto }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Guardar" color="blue" @click="saveSkillRatings" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <skill-rating-form :employee="selectedRow" ref="skill" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showCareerDialog"
    transition-show="rotate"
    transition-hide="rotate"
    full-height
    persistent
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">
            Carrera de {{ selectedRow.nombreCompleto }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <employee-time-line :empleado="selectedRow" :editable="true" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showCV"
    transition-show="slide-up"
    transition-hide="slide-down"
    persistent
    maximized
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">
            Historico y habilidades de {{ selectedRow.nombreCompleto }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <cv-employee :employee="selectedRow" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, inject, watch } from "vue";
import { sendRequest, checkRole, dataIncomplete } from "src/boot/functions";
import EmployeedThreeForm from "src/components/Employeed/EmployeedThreeForm.vue";
import SkillRatingForm from "src/components/Skill/SkillRatingForm.vue";
import EmployeeTimeLine from "src/components/Employeed/EmployeeTimeLine.vue";
import CvEmployee from "src/components/Employeed/CvEmployee.vue";

import EmployeeForm from "src/components/Employeed/EmployeeForm.vue";

const rows = ref([]);
const selectedRow = ref(null);
const add = ref(null);
const showAdd = ref(false);
const edit = ref(null);
const showEdit = ref(false);

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);

const bus = inject("bus"); // inside setup()

const edit_3 = ref(null);
const skill = ref(null);
const skill_valid = ref();

const showFiles = ref(false);
const showSkill = ref(false);
const showCareerDialog = ref(false);
const showCV = ref(false);
const sucursales = ref([]);
const lineas = ref([]);
const departamentos = ref([]);
const puestos = ref([]);

const mes = ref(new Date().getMonth() + 1); // getMonth() devuelve el mes 0-11, por eso sumamos 1
const anio = ref(new Date().getFullYear());

const dates = ref({
  to: null,
  from: null,
});

const filterForm = ref({
  search: null,
  sucursal_id: null,
  linea_id: null,
  departamento_id: null,
  puesto_id: null,
});

const columns = [
  { name: "id", label: "Foto", align: "left", field: "id", sortable: false },
  {
    name: "nombreCompleto",
    label: "Nombre Completo",
    align: "left",
    field: "nombreCompleto",
    sortable: true,
  },
  {
    name: "sucursal",
    label: "Sucursal",
    align: "left",
    field: "sucursal",
    sortable: true,
  },
  {
    name: "linea",
    label: "Linea",
    align: "left",
    field: "linea",
    sortable: true,
  },
  {
    name: "departamento",
    label: "Departamento",
    align: "left",
    field: "departamento",
    sortable: true,
  },
  {
    name: "puesto",
    label: "Puesto",
    align: "left",
    field: "puesto",
    sortable: true,
  },
  {
    name: "estatus",
    label: "Estatus",
    align: "left",
    field: "estatus",
    sortable: true,
  },
  {
    name: "actions",
    label: "Acciones",
    align: "left",
    sortable: true,
  },
];

const openEdit = (item) => {
  selectedRow.value = item;
  showEdit.value = true;
};

const openCareerDialog = (row) => {
  selectedRow.value = row;
  showCareerDialog.value = true;
};

const onRowClickCV = (row) => {
  selectedRow.value = row;
  showCV.value = true;
};

const onRowClickSkill = (row) => {
  selectedRow.value = row;
  showSkill.value = true;
};

const onRowClickFile = (row) => {
  selectedRow.value = row;
  showFiles.value = true;
};

const postRow = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formEmployee,
  };
  let res = await sendRequest("POST", final, "/api/empleado", "");
  showAdd.value = false;
  getRows();
};

const putRow = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...edit.value.formEmployee,
  };
  let res = await sendRequest("PUT", final, "/api/empleado/" + final.id, "");
  showEdit.value = false;
  getRows(current_page.value);
};

const saveSkillRatings = async () => {
  skill_valid.value = await skill.value.validate();
  if (!skill_valid.value) {
    dataIncomplete();
    return;
  }
  let res = await sendRequest(
    "PUT",
    skill.value.skillratings,
    "/api/skillratings",
    ""
  );
  bus.emit("new-skill");
};

const getVacations = async () => {
  const final = {
    ...dates.value,
  };
  let res = await sendRequest("POST", final, "/api/empleados/vacations", "");
  rows.value = res.data;
  filterForm.value.page = res.current_page;
  next_page_url.value = res.next_page_url;
  prev_page_url.value = res.prev_page_url;
  last_page.value = res.last_page;
  current_page.value = 1;
};

const getRows = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/empleados", "");
  rows.value = res.data;
  filterForm.value.page = res.current_page;
  next_page_url.value = res.next_page_url;
  prev_page_url.value = res.prev_page_url;
  last_page.value = res.last_page;
};

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/empleado/index", "");
  sucursales.value = res.sucursales;
  lineas.value = res.lineas;
  departamentos.value = res.departamentos;
  puestos.value = res.puestos;
};

bus.on("cargar_empleados", () => {
  getAll();
  showEdit.value = false;
});

const getKardex = async (mes = null, anio = null) => {
  let url;
  if (mes === null && anio !== null) {
    // Solo se proporciona el año
    url = `/api/empleado/baja/${anio}`;
  } else if (mes === null && anio === null) {
    // No se proporcionan ni el mes ni el año
    url = `/api/empleado/baja`;
  } else {
    // Se proporcionan tanto el mes como el año
    url = `/api/empleado/baja/${anio}/${mes}`;
  }
  let res = await sendRequest("GET", null, url, "");
  rows.value = res;
  next_page_url.value = "";
  prev_page_url.value = "";
  last_page.value = 0;
  current_page.value = 1;
};

const getKardexNew = async (mes = null, anio = null) => {
  let url;
  if (mes === null && anio !== null) {
    // Solo se proporciona el año
    url = `/api/empleado/alta/${anio}`;
  } else if (mes === null && anio === null) {
    // No se proporcionan ni el mes ni el año
    url = `/api/empleado/alta`;
  } else {
    // Se proporcionan tanto el mes como el año
    url = `/api/empleado/alta/${anio}/${mes}`;
  }
  let res = await sendRequest("GET", null, url, "");
  rows.value = res;
  next_page_url.value = "";
  prev_page_url.value = "";
  last_page.value = 0;
  current_page.value = 1;
};

watch(current_page, (newPage) => {
  getRows(newPage);
});

let timeout = null;

const onInputChange = () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    getRows();
  }, 1000);
};

onMounted(() => {
  getRows();
  getForms();
});

const onRowClickExcel = async () => {
  try {
    // Realiza la solicitud a la API para exportar el Excel de acuerdo al ID de la fila
    const final = {
      ...filterForm.value,
    };

    let res = await sendRequest("POST", final, "/api/empleados/excel", "");

    // La respuesta será el archivo en Base64 (viene en la propiedad 'file_base64' de la API)
    const base64Response = await fetch(
      `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${res.file_base64}`
    );

    // Convertimos el archivo Base64 a un Blob
    const blob = await base64Response.blob();

    // Creamos una URL para el Blob
    const url = URL.createObjectURL(blob);

    // Abrimos el archivo en una nueva pestaña o lo descargamos
    window.open(url, "_blank"); // Para abrirlo en una nueva pestaña
    // Para descargarlo automáticamente, puedes usar:
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = 'empleados.xlsx';
    // link.click();
  } catch (error) {
    console.error("Error al exportar el archivo Excel:", error);
  }
};

const onRowClickExcelVacation = async () => {
  try {
    // Realiza la solicitud a la API para exportar el Excel de acuerdo al ID de la fila
    const final = {
      ...dates.value,
    };

    let res = await sendRequest(
      "POST",
      final,
      "/api/empleados/excel/vacations",
      ""
    );

    // La respuesta será el archivo en Base64 (viene en la propiedad 'file_base64' de la API)
    const base64Response = await fetch(
      `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${res.file_base64}`
    );

    // Convertimos el archivo Base64 a un Blob
    const blob = await base64Response.blob();

    // Creamos una URL para el Blob
    const url = URL.createObjectURL(blob);

    // Abrimos el archivo en una nueva pestaña o lo descargamos
    window.open(url, "_blank"); // Para abrirlo en una nueva pestaña
    // Para descargarlo automáticamente, puedes usar:
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = 'empleados.xlsx';
    // link.click();
  } catch (error) {
    console.error("Error al exportar el archivo Excel:", error);
  }
};

// JSON

const months = [
  { id: 1, name: "Enero" },
  { id: 2, name: "Febrero" },
  { id: 3, name: "Marzo" },
  { id: 4, name: "Abril" },
  { id: 5, name: "Mayo" },
  { id: 6, name: "Junio" },
  { id: 7, name: "Julio" },
  { id: 8, name: "Agosto" },
  { id: 9, name: "Septiembre" },
  { id: 10, name: "Octubre" },
  { id: 11, name: "Noviembre" },
  { id: 12, name: "Diciembre" },
];

const years = [
  { id: 2020, name: 2020 },
  { id: 2021, name: 2021 },
  { id: 2022, name: 2022 },
  { id: 2023, name: 2023 },
  { id: 2024, name: 2024 },
  { id: 2025, name: 2025 },
  { id: 2026, name: 2026 },
  { id: 2027, name: 2027 },
  { id: 2028, name: 2028 },
  { id: 2029, name: 2029 },
  { id: 2030, name: 2030 },
];
</script>
