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
            :options="crud.items.sucursales"
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
            :options="crud.items.lineas"
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
            :options="crud.items.departamentos"
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
            :options="crud.items.puestos"
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
        <q-item-section>
          <q-select
            v-model="filterForm.estatus_id"
            :options="crud.items.estatus"
            label="Estatus"
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
        :rows="crud.paginatedItems"
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
                <q-item>
                  <q-btn
                    @click="onRowClickContacts(props.row)"
                    color="primary"
                    flat
                    size="sm"
                    label="Contactos"
                    icon="fa-solid fa-address-book"
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
                <q-item>
                  <q-btn
                    color="primary"
                    @click="onRowClickCompetencias(props.row)"
                    flat
                    size="sm"
                    label="Competencias laborales"
                    icon="fas fa-clipboard-check"
                  />
                </q-item>
                <q-item>
                  <q-btn
                    color="primary"
                    @click="destroyPic(props.row.id)"
                    flat
                    size="sm"
                    label="Borrar foto"
                    icon="fa-solid fa-eraser"
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

        <template v-slot:top-right>
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
          <base-pagination
            :pagination="crud.pagination"
            @update:currentPage="(val) => (crud.pagination.currentPage = val)"
          />
        </template>
      </q-table>
    </q-item-section>
  </q-item>

  <!-- ------------------------------ -->
  <BaseDialog
    titleShow="Registrar empleado"
    maximized
    mode="create"
    v-model="showAdd"
    @submit="postRow"
  >
    <template #form>
      <employee-form ref="add" />
    </template>
  </BaseDialog>

  <BaseDialog
    :titleShow="`Historico y habilidades de ${selectedRow?.nombreCompleto}`"
    maximized
    mode="show"
    v-model="showCV"
  >
    <template #form>
      <cv-employee :employee="selectedRow" />
    </template>
  </BaseDialog>

  <BaseDialog
    :titleShow="`Contactos de ${selectedRow?.nombreCompleto}`"
    maximized
    v-model="showContacts"
    mode="show"
  >
    <template #form>
      <employee-contact :employee="selectedRow" />
    </template>
  </BaseDialog>

  <BaseDialog
    :titleShow="`Actualizar info de ${selectedRow?.nombreCompleto}`"
    maximized
    v-model="showEdit"
    mode="edit"
    @submit="putRow"
  >
    <template #form>
      <employee-form ref="edit" :empleado="selectedRow" />
    </template>
  </BaseDialog>

  <BaseDialog
    :titleShow="`Expediente de ${selectedRow?.nombreCompleto}`"
    maximized
    v-model="showFiles"
    mode="show"
  >
    <template #form>
      <employeed-three-form ref="edit_3" :empleado="selectedRow" />
    </template>
  </BaseDialog>

  <BaseDialog
    :titleShow="`Skill de ${selectedRow?.nombreCompleto}`"
    maximized
    v-model="showSkill"
    mode="edit"
    @submit="saveSkillRatings"
  >
    <template #form>
      <skill-rating-form :employee="selectedRow" ref="skill" />
    </template>
  </BaseDialog>

  <BaseDialog
    :titleShow="`Carrera de ${selectedRow?.nombreCompleto}`"
    maximized
    v-model="showCareerDialog"
    mode="show"
  >
    <template #form>
      <employee-time-line :empleado="selectedRow" :editable="true" />
    </template>
  </BaseDialog>

  <BaseDialog
    :titleShow="`Competencias laborales de ${selectedRow?.nombreCompleto}`"
    maximized
    v-model="showCompetencias"
    mode="edit"
    @submit="saveSkill"
  >
    <template #form>
      <employee-skill :empleado="selectedRow" ref="competencias" />
    </template>
  </BaseDialog>
</template>

<script setup>
import { ref, onMounted, inject, watch } from "vue";
import { sendRequest, checkRole, dataIncomplete } from "src/boot/functions";
import { months, years } from "src/boot/constants";
import { formatDateplusoneSlim } from "src/boot/formatFunctions";
import { useCrudStore } from "src/stores/crud";

import EmployeedThreeForm from "src/components/Employeed/EmployeedThreeForm.vue";
import SkillRatingForm from "src/components/Skill/SkillRatingForm.vue";
import EmployeeTimeLine from "src/components/Employeed/EmployeeTimeLine.vue";
import CvEmployee from "src/components/Employeed/CvEmployee.vue";
import EmployeeContact from "src/components/Employeed/EmployeeContact.vue";
import EmployeeForm from "src/components/Employeed/EmployeeForm.vue";
import BaseDialog from "src/bases/BaseDialog.vue";
import BasePagination from "src/bases/BasePagination.vue";
import EmployeeSkill from "src/components/Employeed/EmployeeSkill.vue";

const crud = useCrudStore();

const bus = inject("bus"); // inside setup()

const selectedRow = ref(null);
const add = ref(null);
const edit = ref(null);
const edit_3 = ref(null);
const skill = ref(null);
const competencias = ref(null);

const showAdd = ref(false);
const showEdit = ref(false);
const showFiles = ref(false);
const showSkill = ref(false);
const showCareerDialog = ref(false);
const showCV = ref(false);
const showContacts = ref(false);
const showCompetencias = ref(null);

const baseURL = "/api/empleado";

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
  estatus_id: 5,
});

const columns = [
  { name: "id", label: "Foto", align: "left", field: "id" },
  {
    name: "nombreCompleto",
    label: "Nombre Completo",
    align: "left",
    field: "nombreCompleto",
  },
  {
    name: "sucursal",
    label: "Sucursal",
    align: "left",
    field: (row) => row.sucursal.nombre,
  },
  {
    name: "linea",
    label: "Linea",
    align: "left",
    field: (row) => row.linea.nombre,
  },
  {
    name: "departamento",
    label: "Departamento",
    align: "left",
    field: (row) => row.departamento.nombre,
  },
  {
    name: "puesto",
    label: "Puesto",
    align: "left",
    field: (row) => row.puesto.nombre,
  },
  {
    name: "fecha_de_ingreso",
    label: "Ingreso",
    align: "left",
    field: (row) => formatDateplusoneSlim(row.fecha_de_ingreso),
  },
  {
    name: "estatus",
    label: "Estatus",
    align: "left",
    field: "estatus",
  },
  {
    name: "actions",
    label: "Acciones",
    align: "left",
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

const onRowClickContacts = (row) => {
  selectedRow.value = row;
  showContacts.value = true;
};

const onRowClickCompetencias = (row) => {
  selectedRow.value = row;
  showCompetencias.value = true;
};

const postRow = async () => {
  const data = { ...add.value.formEmployee };
  await crud.postItem(baseURL, data, add.value.validate, () => {
    showAdd.value = false;
    getRows();
  });
};

const putRow = async () => {
  const data = { ...edit.value.formEmployee };
  await crud.putItem(baseURL, data, edit.value.validate, () => {
    showEdit.value = false;
    getRows();
  });
};

const destroyPic = async (id) => {
  await crud.deleteItem(baseURL + "/destroyPic", id);
  getRows();
};

const saveSkillRatings = async () => {
  const data = { ...skill.value.skillratings };
  await crud.postItem("/api/skillratings", data, skill.value.validate, () => {
    bus.emit("new-skill");
  });
};

const saveSkill = async () => {
  const data = { ...competencias.value };

  let res = await sendRequest("PUT", data, "/api/softSkillsEmpleado", "");
};

const getVacations = async () => {
  await crud.getPaginatedItems(baseURL + "s/vacations", {
    ...dates.value,
    page: 1,
  });
};

const getRows = async () => {
  await crud.getPaginatedItems(baseURL + "s", {
    ...filterForm.value,
    page: crud.pagination.currentPage,
  });
};

bus.on("cargar_empleados", () => {
  getAll();
  showEdit.value = false;
});

const getKardex = async (mes = null, anio = null) => {
  const data = {
    year: anio,
    month: mes,
  };
  await crud.getPaginatedItems(baseURL + "/baja", {
    ...data,
    page: 1,
  });
};

const getKardexNew = async (mes = null, anio = null) => {
  const data = {
    year: anio,
    month: mes,
  };
  await crud.getPaginatedItems(baseURL + "/alta", {
    ...data,
    page: 1,
  });
};

watch(
  () => crud.pagination.currentPage,
  () => {
    getRows();
  }
);

let timeout = null;

const onInputChange = () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    getRows();
  }, 1000);
};

onMounted(() => {
  getRows();
  crud.getItems(baseURL + "/index");
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
    window.open(url, "_blank");
  } catch (error) {
    console.error("Error al exportar el archivo Excel:", error);
  }
};
</script>
