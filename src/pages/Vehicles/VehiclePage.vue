<template>
  <q-item>
    <q-item-section>
      <q-input
        outlined
        dense
        label="Buscar por placa"
        v-model="filterForm.search"
        @update:model-value="onInputChange"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
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
        @update:model-value="getRows()"
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
        @update:model-value="getRows()"
      />
    </q-item-section>
    <q-item-section>
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
    </q-item-section>
    <q-item-section>
      <q-select
        v-model="filterForm.estatus_id"
        :options="types"
        label="Tipo de vehiculo"
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
    </q-item-section>
    <q-item-section side>
      <q-btn
        dense
        label="Agregar"
        color="primary"
        @click="showAdd = true"
        icon="add_circle"
      />
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

        <template v-slot:body-cell-tipo="props">
          <q-td :props="props">
            {{ props.row.estatus.nombre }}
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

        <template v-slot:body-cell-empleados="props">
          <q-td :props="props">
            <div v-for="emp in props.row.empleados" :key="emp.id">
              {{ emp.nombreCompleto }}
            </div>
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
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Agregar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Agregar" color="blue" @click="postRow" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item class="q-pa-none">
        <q-item-section>
          <vehicle-form ref="add" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEdit"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Editar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Actualizar" color="blue" @click="putRow" />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Borrar" color="amber" @click="deleteRow" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <vehicle-form ref="edit" :vehicle="selectedRow" />
        </q-item-section>
      </q-item>
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
          <vehicle-employee ref="asign" :vehicle="selectedRow" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";

import VehicleForm from "src/components/Vehicle/VehicleForm.vue";
import VehicleEmployee from "src/components/Vehicle/VehicleEmployee.vue";

const rows = ref([]);
const selectedRow = ref(null);
const add = ref(null);
const showAdd = ref(false);
const edit = ref(null);
const showEdit = ref(false);

const showAsing = ref(false);
const asign = ref(null);

const departamentos = ref([]);
const lineas = ref([]);
const sucursales = ref([]);
const types = ref([]);

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);

const filterForm = ref({
  search: null,
  departamento_id: null,
  linea_id: null,
  sucursal_id: null,
  estatus_id: null,
});

const columns = [
  {
    name: "edit",
    align: "left",
    field: "edit",
  },
  {
    name: "placas",
    align: "left",
    field: "placas",
    label: "Placas",
  },
  {
    name: "tipo",
    align: "left",
    field: "tipo",
    label: "Tipo",
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
];

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
  types.value = res.estatus;
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

const asignEmployees = async () => {
  const final = {
    ...asign.value.selectedEmpleados,
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
