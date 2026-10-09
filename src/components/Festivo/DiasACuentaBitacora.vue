<template>
  <q-dialog
    v-model="isOpen"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="column full-height bg-grey-1">
      <!-- Barra Superior / Header -->
      <q-bar class="bg-primary text-white q-py-md">
        <q-icon name="history" size="sm" />
        <div class="text-subtitle1 text-weight-bold q-ml-sm">
          Bitácora de Movimientos - Días a Cuenta
        </div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip>Cerrar bitácora</q-tooltip>
        </q-btn>
      </q-bar>

      <!-- Filtros y Controles de Fecha -->
      <q-card-section class="q-pb-sm bg-white q-mb-xs shadow-1">
        <div class="row q-col-gutter-sm items-center">
          <!-- Navegación de Fecha (Día Atrás / Fecha / Día Adelante / Hoy) -->
          <div class="col-12 col-md-auto row items-center no-wrap">
            <q-btn
              flat
              round
              dense
              icon="chevron_left"
              color="primary"
              @click="prevDay"
            >
              <q-tooltip>Día anterior</q-tooltip>
            </q-btn>
            <q-input
              v-model="filterDate"
              dense
              outlined
              type="date"
              label="Fecha"
              style="width: 165px"
              class="q-mx-xs"
              @update:model-value="loadBitacora"
            />
            <q-btn
              flat
              round
              dense
              icon="chevron_right"
              color="primary"
              @click="nextDay"
            >
              <q-tooltip>Día siguiente</q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              color="primary"
              icon="today"
              label="Hoy"
              class="q-ml-xs"
              @click="goToday"
            />
            <q-btn
              flat
              dense
              color="grey-7"
              label="Todas las fechas"
              class="q-ml-xs"
              @click="clearDate"
            >
              <q-tooltip>Ver histórico general sin filtro de fecha</q-tooltip>
            </q-btn>
          </div>

          <!-- Filtro por Estatus -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="filterEstatusId"
              :options="estatusOptions"
              option-value="id"
              option-label="nombre"
              emit-value
              map-options
              outlined
              dense
              clearable
              label="Estatus"
              @update:model-value="loadBitacora"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-badge :color="getEstatusBadgeColor(scope.opt.nombre)">
                      {{ scope.opt.nombre }}
                    </q-badge>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Filtro por Día a Cuenta -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="filterDiaCuentaId"
              :options="diaCuentaOptions"
              option-value="id"
              :option-label="(opt) => opt ? `${opt.nombre} (${formatDateDiaMesAnio(opt.fecha)})` : ''"
              emit-value
              map-options
              outlined
              dense
              clearable
              label="Día a Cuenta"
              @update:model-value="loadBitacora"
            />
          </div>

          <!-- Filtro por Empleado -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="filterEmpleadoId"
              :options="filteredEmpleadoOptions"
              option-value="id"
              :option-label="(opt) => opt ? `${opt.apellido_paterno} ${opt.apellido_materno || ''} ${opt.nombre}`.trim() : ''"
              emit-value
              map-options
              outlined
              dense
              clearable
              use-input
              input-debounce="100"
              @filter="filterEmpleadoFn"
              label="Empleado"
              @update:model-value="loadBitacora"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">Sin coincidencias</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Botón Recargar -->
          <div class="col-auto">
            <q-btn
              round
              dense
              flat
              icon="refresh"
              color="primary"
              @click="loadBitacora"
            >
              <q-tooltip>Recargar</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <!-- Tabla de Registros -->
      <q-card-section class="col q-pa-sm scroll">
        <q-table
          flat
          bordered
          :rows="rows"
          :columns="columns"
          row-key="id"
          dense
          :loading="loading"
          v-model:pagination="pagination"
          :rows-per-page-options="[20, 50, 100, 0]"
          no-data-label="No hay registros en la bitácora con los filtros seleccionados"
          class="bg-white full-height"
        >
          <!-- ID -->
          <template v-slot:body-cell-id="props">
            <q-td :props="props" class="text-grey-8 text-bold">
              #{{ props.row.id }}
            </q-td>
          </template>

          <!-- Estatus -->
          <template v-slot:body-cell-estatus="props">
            <q-td :props="props">
              <q-badge
                v-if="props.row.estatus"
                :color="getEstatusBadgeColor(props.row.estatus.nombre)"
                class="q-px-sm q-py-xs text-bold"
              >
                {{ props.row.estatus.nombre }}
              </q-badge>
              <span v-else class="text-grey-6">-</span>
            </q-td>
          </template>

          <!-- Empleado -->
          <template v-slot:body-cell-empleado="props">
            <q-td :props="props">
              <div v-if="props.row.empleado" class="text-bold">
                {{ props.row.empleado.apellido_paterno }} {{ props.row.empleado.apellido_materno || '' }} {{ props.row.empleado.nombre }}
              </div>
              <div v-else class="text-italic text-grey-7">
                General / Proceso
              </div>
            </q-td>
          </template>

          <!-- Día a Cuenta -->
          <template v-slot:body-cell-dia_cuenta="props">
            <q-td :props="props">
              <div v-if="props.row.dia_cuenta">
                <span class="text-weight-medium">{{ props.row.dia_cuenta.nombre }}</span>
                <span class="text-caption text-grey-8 q-ml-xs">
                  ({{ formatDateDiaMesAnio(props.row.dia_cuenta.fecha) }})
                </span>
              </div>
              <div v-else class="text-grey-6">-</div>
            </q-td>
          </template>

          <!-- Comentario -->
          <template v-slot:body-cell-comentario="props">
            <q-td :props="props" style="white-space: normal; max-width: 480px;">
              {{ props.row.comentario }}
            </q-td>
          </template>

          <!-- Fecha y Hora de Registro -->
          <template v-slot:body-cell-created_at="props">
            <q-td :props="props">
              {{ formatDateTime(props.row.created_at) }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { date } from "quasar";
import { sendRequest } from "src/boot/functions";
import { formatDateplusone } from "src/boot/formatFunctions";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// Helpers de fecha en formato YYYY-MM-DD
const getTodayStr = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const addDays = (dateStr, days) => {
  const base = dateStr ? new Date(dateStr + "T00:00:00") : new Date();
  base.setDate(base.getDate() + days);
  const year = base.getFullYear();
  const month = String(base.getMonth() + 1).padStart(2, "0");
  const day = String(base.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Estados y Filtros
const filterDate = ref(getTodayStr());
const filterEstatusId = ref(null);
const filterDiaCuentaId = ref(null);
const filterEmpleadoId = ref(null);

const rows = ref([]);
const loading = ref(false);

const pagination = ref({
  sortBy: "id",
  descending: false,
  page: 1,
  rowsPerPage: 50,
});

// Opciones de los selects
const estatusOptions = ref([]);
const diaCuentaOptions = ref([]);
const empleadoOptions = ref([]);
const filteredEmpleadoOptions = ref([]);

const columns = [
  {
    name: "id",
    align: "left",
    label: "# ID",
    field: "id",
    sortable: true,
  },
  {
    name: "created_at",
    align: "left",
    label: "Fecha / Hora",
    field: "created_at",
    sortable: true,
  },
  {
    name: "estatus",
    align: "left",
    label: "Estatus",
    field: (row) => row.estatus?.nombre,
    sortable: true,
  },
  {
    name: "empleado",
    align: "left",
    label: "Empleado",
    field: (row) =>
      row.empleado
        ? `${row.empleado.apellido_paterno} ${row.empleado.nombre}`
        : "",
    sortable: true,
  },
  {
    name: "dia_cuenta",
    align: "left",
    label: "Día a Cuenta",
    field: (row) => row.dia_cuenta?.nombre,
    sortable: true,
  },
  {
    name: "comentario",
    align: "left",
    label: "Comentario / Detalle",
    field: "comentario",
    sortable: false,
  },
];

const getEstatusBadgeColor = (nombre) => {
  switch (nombre) {
    case "Solicitud creada":
      return "positive";
    case "Solicitud NO creada (sin días suficientes)":
      return "amber-9";
    case "Solicitud NO creada (día solicitado previamente)":
      return "deep-orange";
    case "Info":
      return "blue-8";
    default:
      return "grey-7";
  }
};

const formatDateDiaMesAnio = (val) => {
  if (!val) return "-";
  const nextDay = date.addToDate(val, { days: 1 });
  return date.formatDate(nextDay, "DD-MM-YYYY");
};

const formatDateTime = (val) => {
  if (!val) return "-";
  return date.formatDate(val, "DD-MM-YYYY HH:mm:ss");
};

// Navegación de Fecha
const prevDay = () => {
  filterDate.value = addDays(filterDate.value || getTodayStr(), -1);
  loadBitacora();
};

const nextDay = () => {
  filterDate.value = addDays(filterDate.value || getTodayStr(), 1);
  loadBitacora();
};

const goToday = () => {
  filterDate.value = getTodayStr();
  loadBitacora();
};

const clearDate = () => {
  filterDate.value = null;
  loadBitacora();
};

// Autocompletado de empleados
const filterEmpleadoFn = (val, update) => {
  if (val === "") {
    update(() => {
      filteredEmpleadoOptions.value = empleadoOptions.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filteredEmpleadoOptions.value = empleadoOptions.value.filter((emp) => {
      const full = `${emp.nombre} ${emp.segundo_nombre || ""} ${emp.apellido_paterno} ${emp.apellido_materno || ""}`.toLowerCase();
      return full.includes(needle);
    });
  });
};

// Carga de opciones de filtrado
const loadOptions = async () => {
  try {
    const res = await sendRequest(
      "GET",
      null,
      "/api/vacationDiaCuenta/bitacora/options"
    );
    if (res) {
      estatusOptions.value = res.estatus || [];
      diaCuentaOptions.value = res.dias_cuenta || [];
      empleadoOptions.value = res.empleados || [];
      filteredEmpleadoOptions.value = res.empleados || [];
    }
  } catch (e) {
    console.error("Error al cargar opciones de bitácora:", e);
  }
};

// Carga de registros de bitácora
const loadBitacora = async () => {
  loading.value = true;
  try {
    const payload = {};
    if (filterDate.value) payload.fecha = filterDate.value;
    if (filterEstatusId.value) payload.estatus_id = filterEstatusId.value;
    if (filterDiaCuentaId.value) payload.dia_cuenta_id = filterDiaCuentaId.value;
    if (filterEmpleadoId.value) payload.empleado_id = filterEmpleadoId.value;

    const res = await sendRequest(
      "POST",
      payload,
      "/api/vacationDiaCuenta/bitacora"
    );
    rows.value = res || [];
  } catch (e) {
    console.error("Error al cargar registros de bitácora:", e);
  } finally {
    loading.value = false;
  }
};

// Al abrir el modal
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      filterDate.value = getTodayStr();
      if (!estatusOptions.value.length) {
        loadOptions();
      }
      loadBitacora();
    }
  }
);
</script>

<style scoped>
</style>
