<template>
  <q-item>
    <q-item-section>
      <div class="row q-col-gutter-sm items-center">
        <div class="col-12 col-sm-6 col-md-3">
          <q-input
            outlined
            dense
            clearable
            label="Buscar (placa, serie, marca, modelo, tipo...)"
            v-model="filterForm.search"
            @update:model-value="onInputChange"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-sm-6 col-md-2">
          <q-select
            v-model="filterForm.marca_id"
            :options="marcas"
            label="Marca"
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
            @update:model-value="getRows()"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-2">
          <q-select
            v-model="filterForm.modelo_id"
            :options="modelos"
            label="Modelo"
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
            @update:model-value="getRows()"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-2">
          <q-select
            v-model="filterForm.tipo_id"
            :options="types"
            label="Tipo de vehículo"
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
            @update:model-value="getRows()"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-3">
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
            @update:model-value="getRows()"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-select
            v-model="filterForm.linea_id"
            :options="lineas"
            label="Línea"
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
            @update:model-value="getRows()"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-select
            v-model="filterForm.departamento_id"
            :options="departamentos"
            label="Departamento"
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
            @update:model-value="getRows()"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-2">
          <q-select
            v-model="filterForm.activo"
            :options="activoOptions"
            label="Estatus"
            emit-value
            map-options
            clearable
            outlined
            dense
            options-dense
            @update:model-value="getRows()"
          />
        </div>

        <div class="col-12 col-md-4 flex justify-end">
          <q-btn
            unelevated
            label="Agregar"
            color="primary"
            @click="showAdd = true"
            icon="add_circle"
          />
        </div>
      </div>
    </q-item-section>
  </q-item>

  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        title="Vehiculos"
        :rows="rows"
        :columns="columns"
        row-key="name"
        dense
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-edit="props">
          <q-td :props="props">
            <q-btn
              dense
              color="teal"
              flat
              icon="visibility"
              @click="openInfo(props.row)"
            >
              <q-tooltip>Ver información</q-tooltip>
            </q-btn>

            <q-btn
              dense
              color="deep-purple"
              flat
              icon="build_circle"
              @click="openServices(props.row)"
            >
              <q-tooltip>Historial de Servicios</q-tooltip>
            </q-btn>

            <q-btn
              dense
              color="blue"
              flat
              icon="edit_square"
              @click="openEdit(props.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>

            <q-btn
              dense
              color="green"
              flat
              icon="person_add"
              @click="openAsing(props.row)"
            >
              <q-tooltip>Asignar</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:body-cell-placas_serie="props">
          <q-td :props="props">
            <div class="text-weight-medium">{{ props.row.placas }}</div>
            <div class="text-caption text-grey-7">{{ props.row.serie }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-vehiculo="props">
          <q-td :props="props">
            <div class="text-weight-medium">
              {{
                [props.row.marca?.nombre, props.row.modelo?.nombre]
                  .filter(Boolean)
                  .join(" ")
              }}
            </div>
            <div class="text-caption text-grey-7">
              {{
                [props.row.tipo?.nombre, props.row.version]
                  .filter(Boolean)
                  .join(" • ")
              }}
            </div>
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

        <template v-slot:body-cell-empleados="props">
          <q-td :props="props">
            <div
              v-for="emp in getVehicleEmpleadosList(props.row)"
              :key="emp.id"
              class="row items-center no-wrap q-gutter-x-xs"
            >
              <span
                :class="
                  props.row.responsable?.id === emp.id ||
                  emp.vehicle_id === props.row.id
                    ? 'text-weight-bold text-primary'
                    : ''
                "
              >
                {{ emp.nombreCompleto }}
              </span>
              <q-badge
                v-if="
                  props.row.responsable?.id === emp.id ||
                  emp.vehicle_id === props.row.id
                "
                color="primary"
                label="Responsable"
              />
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-activo="props">
          <q-td :props="props" class="text-center">
            <q-icon
              :name="props.row.activo == 1 ? 'check_circle' : 'cancel'"
              :color="props.row.activo == 1 ? 'positive' : 'negative'"
              size="md"
            >
              <q-tooltip>
                {{ props.row.activo == 1 ? "Activo" : "Inactivo" }}
              </q-tooltip>
            </q-icon>
          </q-td>
        </template>

        <template v-slot:body-cell-motivo="props">
          <q-td :props="props">
            {{ props.row.motivo_baja }}
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

  <q-dialog
    v-model="showAdd"
    transition-show="scale"
    transition-hide="scale"
    persistent
  >
    <q-card style="width: 680px; max-width: 95vw" class="q-pa-none">
      <q-card-section class="bg-primary text-white q-py-sm">
        <div class="row items-center no-wrap">
          <q-avatar
            icon="add_circle"
            color="white"
            text-color="primary"
            size="md"
            class="q-mr-sm"
          />
          <div class="col">
            <div class="text-h6 leading-tight">Registrar Vehículo</div>
            <div class="text-caption text-blue-1">
              Complete los datos de identificación y asignación de la unidad
            </div>
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-none scroll" style="max-height: 75vh">
        <vehicle-form ref="add" :catalogs="catalogs" />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-sm bg-grey-2">
        <q-btn flat label="Cancelar" color="grey-8" v-close-popup />
        <q-btn
          unelevated
          label="Guardar Vehículo"
          color="primary"
          icon="save"
          @click="postRow"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEdit"
    transition-show="scale"
    transition-hide="scale"
    persistent
  >
    <q-card style="width: 680px; max-width: 95vw" class="q-pa-none">
      <q-card-section class="bg-primary text-white q-py-sm">
        <div class="row items-center no-wrap">
          <q-avatar
            icon="edit_square"
            color="white"
            text-color="primary"
            size="md"
            class="q-mr-sm"
          />
          <div class="col">
            <div class="text-h6 leading-tight">Editar Vehículo</div>
            <div class="text-caption text-blue-1" v-if="selectedRow">
              Placa: <strong>{{ selectedRow.placas }}</strong> &bull; Serie:
              <strong>{{ selectedRow.serie }}</strong>
            </div>
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-none scroll" style="max-height: 75vh">
        <vehicle-form ref="edit" :vehicle="selectedRow" :catalogs="catalogs" />
      </q-card-section>

      <q-separator />

      <q-card-actions align="between" class="q-pa-sm bg-grey-2">
        <div>
          <q-btn
            v-if="selectedRow?.activo == 1"
            outline
            label="Dar de Baja"
            color="negative"
            icon="block"
            @click="showBajaDialog = true"
          />
          <q-btn
            v-if="selectedRow?.activo == 0"
            outline
            label="Activar Unidad"
            color="positive"
            icon="check_circle"
            @click="activarVehicle"
          />
        </div>
        <div class="q-gutter-x-sm">
          <q-btn flat label="Cancelar" color="grey-8" v-close-popup />
          <q-btn
            unelevated
            label="Actualizar"
            color="primary"
            icon="save"
            @click="putRow"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Dialog para razón de baja -->
  <q-dialog v-model="showBajaDialog" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="bg-negative text-white">
        <div class="text-h6">Dar de Baja Vehículo</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="motivoBaja"
          type="textarea"
          label="Razón de la baja"
          outlined
          autogrow
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="grey" v-close-popup />
        <q-btn label="Confirmar Baja" color="negative" @click="darDeBaja" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showAsing"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Asignar vehiculo</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Asignar" color="blue" @click="asignEmployees" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <vehicle-employee
            ref="asign"
            :vehicle="selectedRow"
            :empleados-list="empleados"
          />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showInfo" transition-show="scale" transition-hide="scale">
    <vehicle-card :vehicle="infoVehicle" />
  </q-dialog>

  <q-dialog
    v-model="showServices"
    transition-show="scale"
    transition-hide="scale"
  >
    <vehicle-services-dashboard
      :vehicle="servicesVehicle"
      :loading="loadingServices"
    />
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";
import { computed } from "vue";

import VehicleForm from "src/components/Vehicle/VehicleForm.vue";
import VehicleEmployee from "src/components/Vehicle/VehicleEmployee.vue";
import VehicleCard from "src/components/Vehicle/VehicleCard.vue";
import VehicleServicesDashboard from "src/components/Vehicle/VehicleServicesDashboard.vue";

const rows = ref([]);
const selectedRow = ref(null);
const infoVehicle = ref(null);
const showInfo = ref(false);
const servicesVehicle = ref(null);
const showServices = ref(false);
const loadingServices = ref(false);
const add = ref(null);
const showAdd = ref(false);
const edit = ref(null);
const showEdit = ref(false);

const showBajaDialog = ref(false);
const motivoBaja = ref("");

const showAsing = ref(false);
const asign = ref(null);

const departamentos = ref([]);
const lineas = ref([]);
const sucursales = ref([]);
const marcas = ref([]);
const modelos = ref([]);
const types = ref([]);
const empleados = ref([]);

const catalogs = computed(() => ({
  sucursales: sucursales.value,
  lineas: lineas.value,
  departamentos: departamentos.value,
  marcas: marcas.value,
  modelos: modelos.value,
  tipos: types.value,
}));

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);

const filterForm = ref({
  search: null,
  marca_id: null,
  modelo_id: null,
  tipo_id: null,
  departamento_id: null,
  linea_id: null,
  sucursal_id: null,
  activo: 1,
});

const activoOptions = [
  { label: "Activos", value: 1 },
  { label: "Inactivos", value: 0 },
];

const columns = computed(() => {
  const base = [
    {
      name: "edit",
      align: "left",
      field: "edit",
    },
    {
      name: "placas_serie",
      align: "left",
      field: "placas_serie",
      label: "Placas / Serie",
    },
    {
      name: "vehiculo",
      align: "left",
      field: "vehiculo",
      label: "Vehículo (Marca / Modelo / Tipo / Versión)",
    },
    {
      name: "anio",
      align: "left",
      field: "anio",
      label: "Año",
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
      name: "empleados",
      align: "left",
      field: "empleados",
      label: "Encargados",
    },
    {
      name: "activo",
      align: "center",
      field: "activo",
      label: "Activo",
    },
  ];
  if (filterForm.value.activo == 0) {
    base.push({
      name: "motivo",
      align: "left",
      field: "motivo",
      label: "Motivo Baja",
    });
  }

  return base;
});

const getVehicleEmpleadosList = (row) => {
  const list = [...(row?.empleados || [])];
  if (
    row?.responsable &&
    !list.some((e) => Number(e.id) === Number(row.responsable.id))
  ) {
    list.unshift(row.responsable);
  }
  return list;
};

const openInfo = async (item) => {
  infoVehicle.value = item;
  showInfo.value = true;
  let res = await sendRequest("GET", null, "/api/vehicle/" + item.id, "");
  if (res) {
    infoVehicle.value = res;
  }
};

const openServices = async (item) => {
  servicesVehicle.value = item;
  loadingServices.value = true;
  showServices.value = true;
  try {
    let res = await sendRequest("GET", null, "/api/vehicle/" + item.id, "");
    if (res) {
      servicesVehicle.value = res;
    }
  } finally {
    loadingServices.value = false;
  }
};

const openEdit = (item) => {
  selectedRow.value = item;
  showEdit.value = true;
};

const openAsing = (item) => {
  selectedRow.value = item;
  showAsing.value = true;
};

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/vehicle/forms", "");
  sucursales.value = res.sucursales;
  lineas.value = res.lineas;
  departamentos.value = res.departamentos;
  marcas.value = res.marcas;
  modelos.value = res.modelos;
  types.value = res.tipos;
  empleados.value = res.empleados;
};

const getRows = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/vehicles", "");
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
    ...add.value.formVehicle,
  };
  let res = await sendRequest("POST", final, "/api/vehicle", "");
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
    ...edit.value.formVehicle,
  };
  let res = await sendRequest("PUT", final, "/api/vehicle/" + final.id, "");
  showEdit.value = false;
  getRows(current_page.value);
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/vehicle/" + selectedRow.value.id,
    ""
  );
  selectedRow.value = null;
  showEdit.value = false;
  getRows();
};

const darDeBaja = async () => {
  if (!motivoBaja.value) {
    dataIncomplete();
    return;
  }

  let payload = {
    baja: 0,
    motivo_baja: motivoBaja.value,
  };

  await sendRequest(
    "PUT",
    payload,
    "/api/vehicle/baja/" + selectedRow.value.id,
    ""
  );

  showBajaDialog.value = false;
  showEdit.value = false;
  motivoBaja.value = "";

  getRows(current_page.value);
};

const activarVehicle = async () => {
  let payload = {
    baja: 1,
    motivo_baja: null,
  };

  await sendRequest(
    "PUT",
    payload,
    "/api/vehicle/activar/" + selectedRow.value.id,
    ""
  );

  showBajaDialog.value = false;
  showEdit.value = false;
  motivoBaja.value = "";

  getRows(current_page.value);
};

const asignEmployees = async () => {
  const final = {
    responsable_id: asign.value.selectedResponsable,
    usuarios: asign.value.selectedEmpleados,
  };
  let res = await sendRequest(
    "POST",
    final,
    "/api/vehicle/asign/" + selectedRow.value.id,
    ""
  );
  showAsing.value = false;
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

onMounted(() => {
  getRows();
  getForms();
});
</script>
