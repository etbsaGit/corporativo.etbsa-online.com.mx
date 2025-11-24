<template>
  <q-item>
    <q-item-section avatar>
      <q-select
        v-model="filterForm.status"
        :options="options"
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
        @update:model-value="onInputChange"
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
        outlined
        clearable
        dense
        options-dense
        @update:model-value="onInputChange"
      />
    </q-item-section>
    <q-item-section>
      <q-select
        v-model="filterForm.empleado_id"
        :options="filterEmpleados"
        label="Empleado"
        option-value="id"
        option-label="apellidoCompleto"
        option-disable="inactive"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        outlined
        dense
        clearable
        options-dense
        use-input
        @filter="filterFn"
        input-debounce="0"
        behavior="menu"
        @update:model-value="onInputChange"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> no options </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-item-section>
    <q-item-section>
      <q-select
        v-model="filterForm.month"
        :options="months"
        label="Mes"
        option-value="id"
        option-label="nombre"
        option-disable="inactive"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        outlined
        clearable
        dense
        options-dense
        @update:model-value="onInputChange"
      />
    </q-item-section>
    <q-item-section side>
      <q-btn
        dense
        label="Crear solicitud"
        color="primary"
        @click="showAdd = true"
        icon="add_circle"
      />
    </q-item-section>
    <q-item-section side>
      <q-btn
        dense
        color="primary"
        @click="getReportExcel"
        icon="fa-solid fa-file-arrow-down"
      />
    </q-item-section>
  </q-item>

  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        title="Permisos 2 horas"
        :rows="rows"
        :columns="columns"
        row-key="name"
        dense
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-edit="props">
          <q-td :props="props">
            <q-btn
              v-if="props.row.status == null || checkRole('RRHH')"
              dense
              color="red"
              flat
              icon="delete"
              @click="openDelete(props.row)"
            />
            <q-btn
              v-if="props.row.status == null || checkRole('RRHH')"
              dense
              color="blue"
              flat
              icon="edit_square"
              @click="openEdit(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-btn-dropdown
              :color="getDropdownProps(props.row.status).color"
              :text-color="getDropdownProps(props.row.status).textColor"
              :icon="getDropdownProps(props.row.status).icon"
              :label="getDropdownProps(props.row.status).label"
            >
              <q-list>
                <q-item
                  v-if="props.row.status != 0"
                  clickable
                  v-close-popup
                  @click="putStatus(props.row.id, 0)"
                  class="bg-red"
                >
                  <q-item-section>
                    <q-chip
                      color="red"
                      text-color="white"
                      icon="disabled_by_default"
                      label="No autorizada"
                    />
                  </q-item-section>
                </q-item>

                <q-item
                  v-if="props.row.status != 1"
                  clickable
                  v-close-popup
                  @click="putStatus(props.row.id, 1)"
                  class="bg-green"
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

  <BaseDialog v-model="showAdd" mode="create" @submit="postRow">
    <template #form>
      <permiso-form ref="add" />
    </template>
  </BaseDialog>

  <BaseDialog v-model="showEdit" mode="edit" @submit="putRow">
    <template #form>
      <permiso-form ref="edit" :permiso="selectedRow" />
    </template>
  </BaseDialog>

  <BaseDialog v-model="showDelete" mode="delete" @submit="deleteRow">
    <template #delete-message>
      ¿Estás seguro que deseas eliminar este elemento?
    </template>
  </BaseDialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest, dataIncomplete, checkRole } from "src/boot/functions";
import { formatDateplusoneSlim } from "src/boot/formatFunctions";

import BaseDialog from "src/bases/BaseDialog.vue";
import PermisoForm from "src/components/SalidaPermisos/PermisoForm.vue";

const rows = ref([]);
const selectedRow = ref(null);
const add = ref(null);
const showAdd = ref(false);
const edit = ref(null);
const showEdit = ref(false);
const showDelete = ref(false);

const filterEmpleados = ref(null);

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);

const empleados = ref([]);
const sucursales = ref([]);

const filterForm = ref({
  empleado_id: null,
  sucursal_id: null,
  status: null,
  date: null,
  month: null,
});

const columns = [
  {
    name: "edit",
    align: "left",
    field: "edit",
  },
  {
    name: "empleado",
    align: "left",
    label: "Empleado",
    field: (row) => row.empleado.nombreCompleto,
  },
  {
    name: "date",
    align: "left",
    label: "Dia",
    field: (row) => formatDateplusoneSlim(row.date),
  },
  {
    name: "horas",
    align: "left",
    label: "Inicio - Termino",
    field: (row) =>
      mergeHours(row.start, row.end, row.lunch_start, row.lunch_end),
  },
  {
    name: "created_at",
    align: "left",
    label: "Creacion",
    field: (row) => formatDateplusoneSlim(row.created_at),
  },
  {
    name: "status",
    align: "left",
    field: "status",
    label: "Estatus",
  },
];

const openEdit = (item) => {
  selectedRow.value = item;
  showEdit.value = true;
};

const openDelete = (item) => {
  selectedRow.value = item;
  showDelete.value = true;
};

const getRows = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/salidaPermisos", "");
  rows.value = res.data;
  filterForm.value.page = res.current_page;
  next_page_url.value = res.next_page_url;
  prev_page_url.value = res.prev_page_url;
  last_page.value = res.last_page;
};

const getForms = async () => {
  const year = ref(new Date().getFullYear());
  let res = await sendRequest("GET", null, "/api/salidaPermiso/forms", "");
  empleados.value = res.empleados;
  sucursales.value = res.sucursales;
};

const postRow = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formPermiso,
  };
  let res = await sendRequest("POST", final, "/api/salidaPermiso", "");
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
    ...edit.value.formPermiso,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/salidaPermiso/" + final.id,
    ""
  );
  showEdit.value = false;
  getRows(current_page.value);
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/salidaPermiso/" + selectedRow.value.id,
    ""
  );
  selectedRow.value = null;
  showDelete.value = false;
  getRows();
};

const putStatus = async (id, status) => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/salidaPermiso/status/" + id + "/" + status,
    ""
  );
  getRows(current_page.value);
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

const filterFn = (val, update) => {
  if (val === "") {
    update(() => {
      filterEmpleados.value = empleados.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filterEmpleados.value = empleados.value.filter(
      (empleado) => empleado.nombreCompleto.toLowerCase().indexOf(needle) > -1
    );
  });
};

function getDropdownProps(status) {
  if (status === 0) {
    return {
      color: "red",
      textColor: "white",
      icon: "disabled_by_default",
      label: "No autorizada",
    };
  } else if (status === 1) {
    return {
      color: "green",
      textColor: "white",
      icon: "check_box",
      label: "Autorizada",
    };
  } else {
    return {
      color: "orange",
      textColor: "white",
      icon: "check_box_outline_blank",
      label: "Pendiente",
    };
  }
}

function formatHour(time) {
  if (!time) return "";
  try {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return time; // por si el formato no es HH:mm
  }
}

function mergeHours(start, end, lunch_start, lunch_end) {
  if (!start || !end) return "";

  // Normalizar formato
  const s = formatHour(start);
  const e = formatHour(end);
  const ls = lunch_start ? formatHour(lunch_start) : null;
  const le = lunch_end ? formatHour(lunch_end) : null;

  // Comparar sin formato (para saber si se tocan)
  const normalize = (t) => t?.slice(0, 5); // "08:00"
  const sRaw = normalize(start);
  const eRaw = normalize(end);
  const lsRaw = normalize(lunch_start);
  const leRaw = normalize(lunch_end);

  // Caso 1: si termina justo cuando empieza el almuerzo
  if (eRaw === lsRaw) {
    return `${s} - ${le}`;
  }

  // Caso 2: si empieza justo cuando termina el almuerzo
  if (leRaw === sRaw) {
    return `${ls} - ${e}`;
  }

  // Caso 3: si no se tocan y hay horario de almuerzo definido
  if (ls && le) {
    return `${s} - ${e}, ${ls} - ${le}`;
  }

  // Caso base
  return `${s} - ${e}`;
}

const getReportExcel = async () => {
  const final = {
    ...filterForm.value,
  };
  const res = await sendRequest("POST", final, "/api/salidaPermisos/xls", "");
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

onMounted(() => {
  getRows();
  getForms();
});

const options = ref([
  { label: "Autorizada", value: 1 },
  { label: "Rechazada", value: 0 },
  { label: "Pendiente", value: null },
]);

const months = [
  { id: 1, nombre: "Enero" },
  { id: 2, nombre: "Febrero" },
  { id: 3, nombre: "Marzo" },
  { id: 4, nombre: "Abril" },
  { id: 5, nombre: "Mayo" },
  { id: 6, nombre: "Junio" },
  { id: 7, nombre: "Julio" },
  { id: 8, nombre: "Agosto" },
  { id: 9, nombre: "Septiembre" },
  { id: 10, nombre: "Octubre" },
  { id: 11, nombre: "Noviembre" },
  { id: 12, nombre: "Diciembre" },
];
</script>
