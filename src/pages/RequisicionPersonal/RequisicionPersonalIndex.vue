<template>
  <BaseDialog
    v-model="showFilters"
    full-width
    position="top"
    transitionShow="slide-down"
    transitionHide="slide-up"
    mode="filters"
    @submit="getRows"
  >
    <template #form>
      <q-item>
        <q-item-section>
          <q-select
            v-model="filterForm.tipo_vacante"
            :options="['Remplazo', 'Nueva Creación', 'Temporal', 'Permanente']"
            label="Tipo de vacante"
            outlined
            dense
            options-dense
            clearable
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.autorizacion"
            :options="autorizaciones"
            label="Autorizacion"
            option-value="value"
            option-label="label"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            outlined
            dense
            options-dense
            clearable
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.estatus"
            :options="estatus"
            label="Estatus"
            option-value="value"
            option-label="label"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            outlined
            dense
            options-dense
            clearable
          />
        </q-item-section>
      </q-item>
      <q-item>
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
            options-dense
          />
        </q-item-section>
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
            options-dense
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
            options-dense
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
            options-dense
          />
        </q-item-section>
      </q-item>
    </template>
  </BaseDialog>

  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        :rows="rows"
        :columns="columns"
        row-key="name"
        dense
        :visible-columns="visibleColumns"
      >
        <template v-slot:top>
          <strong>Solicitudes de personal</strong>

          <q-space />
          <q-item>
            <q-select
              v-model="visibleColumns"
              multiple
              outlined
              dense
              options-dense
              :display-value="$q.lang.table.columns"
              emit-value
              map-options
              :options="columns"
              option-value="name"
              options-cover
            />
          </q-item>
          <q-item v-if="checkRole('RRHH')">
            <q-btn
              round
              outline
              color="primary"
              @click="getReportExcel()"
              icon="fa-solid fa-file-excel"
            />
          </q-item>
          <q-item v-if="checkRole('RRHH')">
            <q-btn
              round
              outline
              color="primary"
              @click="showCalendar = true"
              icon="fa-solid fa-calendar-days"
            />
          </q-item>
          <q-item v-if="checkRole('RRHH')">
            <q-btn
              outline
              round
              color="primary"
              icon="fa-solid fa-filter"
              @click="showFilters = true"
            />
          </q-item>
          <q-item>
            <q-btn
              round
              outline
              color="primary"
              @click="openCreate"
              icon="fa-solid fa-plus"
            />
          </q-item>
        </template>

        <template v-slot:body-cell-edit="props">
          <q-td>
            <q-item
              dense
              v-if="
                (props.row.solicita_id === user.empleado?.id ||
                  checkRole('RRHH')) &&
                props.row.autorizacion === 0
              "
            >
              <q-item-section avatar>
                <q-btn
                  dense
                  color="red"
                  flat
                  icon="delete"
                  @click="openDelete(props.row)"
                />
              </q-item-section>
              <q-item-section avatar>
                <q-btn
                  dense
                  color="blue"
                  flat
                  icon="edit_square"
                  @click="openEdit(props.row)"
                />
              </q-item-section>
            </q-item>
          </q-td>
        </template>

        <template v-slot:body-cell-show="props">
          <q-td :props="props">
            <q-btn
              dense
              color="blue"
              flat
              icon="fa-regular fa-eye"
              @click="openShow(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-puesto="props">
          <q-td :props="props">
            {{ props.row.puesto?.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-sucursal="props">
          <q-td :props="props">
            {{ props.row.sucursal?.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-linea="props">
          <q-td :props="props">
            {{ props.row.linea?.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-departamento="props">
          <q-td :props="props">
            {{ props.row.departamento?.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-created_at="props">
          <q-td :props="props">
            {{ formatDateSlim(props.row.created_at) }}
          </q-td>
        </template>

        <template v-slot:body-cell-auth="props">
          <q-td :props="props">
            {{ props.row.auth?.nombreCompleto }}
          </q-td>
        </template>

        <template v-slot:body-cell-candidatos="props">
          <q-td>
            <q-item dense>
              <q-item-section avatar>
                <q-btn
                  dense
                  color="green-9"
                  flat
                  icon="fa-regular fa-address-book"
                  @click="openCandidatos(props.row)"
                />
              </q-item-section>
            </q-item>
          </q-td>
        </template>

        <template v-slot:body-cell-autorizacion="props">
          <q-td :props="props">
            <q-btn-dropdown
              v-if="
                props.row.autoriza_id === user.empleado?.id ||
                props.row.vo_bo_id === user.empleado?.id ||
                checkRole('Admin')
              "
              dense
              :color="getDropdownPropsAut(props.row.autorizacion).color"
              :text-color="
                getDropdownPropsAut(props.row.autorizacion).textColor
              "
              :icon="getDropdownPropsAut(props.row.autorizacion).icon"
              :label="getDropdownPropsAut(props.row.autorizacion).label"
            >
              <q-list dense>
                <q-item
                  v-if="props.row.autorizacion != 2"
                  clickable
                  v-close-popup
                  class="bg-red"
                  @click="changeAuth(props.row.id, 2)"
                >
                  <q-item-section>
                    <q-chip
                      color="red"
                      text-color="white"
                      icon="disabled_by_default"
                      label="Rechazada"
                    />
                  </q-item-section>
                </q-item>

                <q-item
                  v-if="props.row.autorizacion != 1"
                  clickable
                  v-close-popup
                  class="bg-green"
                  @click="changeAuth(props.row.id, 1)"
                >
                  <q-item-section>
                    <q-chip
                      color="green"
                      text-color="white"
                      icon="check_box"
                      label="Autorizada"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-chip
              v-else
              :color="getDropdownPropsAut(props.row.autorizacion).color"
              :text-color="
                getDropdownPropsAut(props.row.autorizacion).textColor
              "
              :icon="getDropdownPropsAut(props.row.autorizacion).icon"
              :label="getDropdownPropsAut(props.row.autorizacion).label"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-btn-dropdown
              v-if="checkRole('RRHH')"
              dense
              :color="getDropdownPropsStatus(props.row.estatus).color"
              :text-color="getDropdownPropsStatus(props.row.estatus).textColor"
              :icon="getDropdownPropsStatus(props.row.estatus).icon"
              :label="getDropdownPropsStatus(props.row.estatus).label"
            >
              <q-list dense>
                <q-item
                  v-if="props.row.estatus != 1"
                  clickable
                  v-close-popup
                  class="bg-blue-6"
                  @click="changeEstatus(props.row.id, 1)"
                >
                  <q-item-section>
                    <q-chip
                      color="blue-6"
                      text-color="white"
                      icon="fa-solid fa-magnifying-glass-plus"
                      label="En reclutamiento"
                    />
                  </q-item-section>
                </q-item>

                <q-item
                  v-if="props.row.estatus != 2"
                  clickable
                  v-close-popup
                  class="bg-blue-9"
                  @click="changeEstatus(props.row.id, 2)"
                >
                  <q-item-section>
                    <q-chip
                      color="blue-9"
                      text-color="white"
                      icon="fa-solid fa-clipboard-check"
                      label="Finalizada"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-chip
              v-else
              square
              :color="getDropdownPropsStatus(props.row.estatus).color"
              :text-color="getDropdownPropsStatus(props.row.estatus).textColor"
              :icon="getDropdownPropsStatus(props.row.estatus).icon"
              :label="getDropdownPropsStatus(props.row.estatus).label"
            />
          </q-td>
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

  <BaseDialog fullWidth v-model="showAdd" mode="create" @submit="postRow">
    <template #form>
      <requisicion-personal-form ref="add" />
    </template>
  </BaseDialog>

  <BaseDialog fullWidth v-model="showEdit" mode="edit" @submit="putRow">
    <template #form>
      <requisicion-personal-form ref="edit" :requisicion="selectedRow" />
    </template>
  </BaseDialog>

  <BaseDialog v-model="showDelete" mode="delete" @submit="deleteRow">
    <template #delete-message>
      ¿Estás seguro que deseas eliminar este elemento?
    </template>
  </BaseDialog>

  <BaseDialog
    maximized
    mode="show"
    v-model="showCandidatos"
    titleShow="Candidatos"
  >
    <template #form>
      <candidato-index :requisicion="selectedRow" />
    </template>
  </BaseDialog>

  <BaseDialog v-model="showShow" mode="show" titleShow="Detalle">
    <template #form>
      <requisicion-personal-card :requisicion="selectedRow" />
    </template>
  </BaseDialog>

  <BaseDialog
    maximized
    v-model="showCalendar"
    mode="show"
    titleShow="Calendario"
  >
    <template #form>
      <candidato-calendar />
    </template>
  </BaseDialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest, dataIncomplete, checkRole } from "src/boot/functions";
import { useAuthStore } from "src/stores/auth";

import BaseDialog from "src/bases/BaseDialog.vue";
import RequisicionPersonalForm from "src/components/RequisicionPersonal/RequisicionPersonalForm.vue";
import CandidatoIndex from "src/components/Candidato/CandidatoIndex.vue";
import RequisicionPersonalCard from "src/components/RequisicionPersonal/RequisicionPersonalCard.vue";
import CandidatoCalendar from "src/components/Candidato/CandidatoCalendar.vue";
import { formatDateSlim } from "src/boot/formatFunctions";

const authStore = useAuthStore();
const user = authStore.authUser;

const rows = ref([]);
const selectedRow = ref(null);
const add = ref(null);
const showAdd = ref(false);
const edit = ref(null);
const showEdit = ref(false);
const showFilters = ref(false);
const showDelete = ref(false);
const showCandidatos = ref(false);
const showShow = ref(false);
const showCalendar = ref(false);

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);

const puestos = ref([]);
const sucursales = ref([]);
const lineas = ref([]);
const departamentos = ref([]);
const autorizaciones = ref([
  { value: 0, label: "Pendiente" },
  { value: 1, label: "Autorizada" },
  { value: 2, label: "Rechazada" },
]);
const estatus = ref([
  { value: 0, label: "Esperando autorizacion" },
  { value: 1, label: "Reclutamiento" },
  { value: 2, label: "Finalizada" },
]);

const filterForm = ref({
  tipo_vacante: null,
  puesto_id: null,
  sucursal_id: null,
  linea_id: null,
  departamento_id: null,
  estatus: null,
  autorizacion: null,
});

const columns = [
  {
    name: "edit",
    align: "left",
    field: "edit",
    label: "Borrar / Editar",
  },
  {
    name: "show",
    align: "left",
    field: "show",
    label: "Ver",
  },
  {
    name: "tipo_vacante",
    align: "left",
    field: "tipo_vacante",
    label: "Tipo de vacante",
  },
  {
    name: "puesto",
    align: "left",
    field: "puesto",
    label: "Puesto",
  },
  {
    name: "sucursal",
    align: "left",
    field: "sucursal",
    label: "Sucursal",
  },
  {
    name: "linea",
    align: "left",
    field: "linea",
    label: "Linea",
  },
  {
    name: "departamento",
    align: "left",
    field: "departamento",
    label: "Departamento",
  },
  {
    name: "created_at",
    align: "left",
    field: "created_at",
    label: "Creacion",
  },
  {
    name: "autorizacion",
    align: "left",
    field: "autorizacion",
    label: "Autorizacion",
  },
  {
    name: "auth",
    align: "left",
    field: "auth",
    label: "Validado por:",
  },
  {
    name: "status",
    align: "left",
    field: "status",
    label: "Estatus",
  },
  {
    name: "candidatos",
    align: "left",
    field: "candidatos",
    label: "Candidatos",
  },
];

const visibleColumns = ref([
  "edit",
  "show",
  "tipo_vacante",
  "puesto",
  "sucursal",
  "linea",
  "departamento",
  "candidatos",
  "autorizacion",
  "status",
  "created_at",
]);

const openCreate = () => {
  selectedRow.value = null; // nuevo registro vacío
  showAdd.value = true;
};

const openEdit = (item) => {
  selectedRow.value = item;
  showEdit.value = true;
};

const openDelete = (item) => {
  selectedRow.value = item;
  showDelete.value = true;
};

const openCandidatos = (item) => {
  selectedRow.value = item;
  showCandidatos.value = true;
};

const openShow = (item) => {
  selectedRow.value = item;
  showShow.value = true;
};

const getForms = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/requisicionPersonal/forms",
    ""
  );
  sucursales.value = res.sucursales;
  lineas.value = res.lineas;
  departamentos.value = res.departamentos;
  puestos.value = res.puestos;
};

const getRows = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/requisicionPersonales", "");
  rows.value = res.data;
  filterForm.value.page = res.current_page;
  next_page_url.value = res.next_page_url;
  prev_page_url.value = res.prev_page_url;
  last_page.value = res.last_page;
};

const postRow = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formRequisicion,
  };
  let res = await sendRequest("POST", final, "/api/requisicionPersonal", "");
  showAdd.value = false;
  getRows(current_page.value);
};

const putRow = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...edit.value.formHerramienta,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/requisicionPersonal/" + final.id,
    ""
  );
  showEdit.value = false;
  getRows(current_page.value);
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/requisicionPersonal/" + selectedRow.value.id,
    ""
  );
  selectedRow.value = null;
  showDelete.value = false;
  getRows();
};

const changeEstatus = async (id, status) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/requisicionPersonal/status/" + id + "/" + status,
    ""
  );
  getRows(current_page.value);
};

const changeAuth = async (id, auth) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/requisicionPersonal/auth/" + id + "/" + auth,
    ""
  );
  getRows(current_page.value);
};

const getReportExcel = async () => {
  const res = await sendRequest("GET", null, "/api/candidatos/xls", "");
  const base64Response = await fetch(
    `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${res.file_base64}`
  );
  const blob = await base64Response.blob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = res.file_name;
  link.click();
  URL.revokeObjectURL(url);
};

function getDropdownPropsAut(validated) {
  if (validated === 0) {
    return {
      color: "orange",
      textColor: "white",
      icon: "check_box_outline_blank",
      label: "Pendiente",
    };
  } else if (validated === 1) {
    return {
      color: "green",
      textColor: "white",
      icon: "check_box",
      label: "Autorizada",
    };
  } else if (validated === 2) {
    return {
      color: "red",
      textColor: "white",
      icon: "disabled_by_default",
      label: "Rechazada",
    };
  } else {
    return {
      color: "primary",
      textColor: "white",
      icon: "check_box_outline_blank",
      label: "Sin estatus",
    };
  }
}

function getDropdownPropsStatus(validated) {
  if (validated === 0) {
    return {
      color: "blue-3",
      textColor: "white",
      icon: "fa-regular fa-hourglass-half",
      label: "Esperando autorizacion",
    };
  } else if (validated === 1) {
    return {
      color: "blue-6",
      textColor: "white",
      icon: "fa-solid fa-magnifying-glass-plus",
      label: "En reclutamiento",
    };
  } else if (validated === 2) {
    return {
      color: "blue-9",
      textColor: "white",
      icon: "fa-solid fa-clipboard-check",
      label: "Finalizada",
    };
  } else {
    return {
      color: "primary",
      textColor: "white",
      icon: "fa-regular fa-hourglass-half",
      label: "Sin estatus",
    };
  }
}

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
</script>
