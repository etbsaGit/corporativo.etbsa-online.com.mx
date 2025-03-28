<template>
  <q-item>
    <q-item-section>
      <q-select
        v-model="filterForm.month"
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
        options-dense
        @update:model-value="onInputChange"
      />
    </q-item-section>
    <q-item-section>
      <q-select
        v-model="filterForm.year"
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
        options-dense
        @update:model-value="onInputChange"
      />
    </q-item-section>
    <q-item-section v-if="checkRole('Admin')">
      <q-select
        v-model="filterForm.empleado_id"
        :options="filterEmpleados"
        label="Empleado"
        option-value="id"
        option-label="nombreCompleto"
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
    <q-item-section side>
      <q-btn
        dense
        label="Agendar visita"
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
        title="Agenda de visitas"
        :rows="rows"
        :columns="columns"
        row-key="name"
        dense
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-edit="props">
          <q-td :props="props">
            <q-btn
              v-if="props.row.validated == null"
              dense
              color="primary"
              flat
              icon="edit_square"
              @click="openEdit(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-empleado="props">
          <q-td :props="props">
            {{ props.row.empleado.nombreCompleto }}
          </q-td>
        </template>

        <template v-slot:body-cell-cliente="props">
          <q-td :props="props">
            {{ props.row.prospect.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-dia="props">
          <q-td :props="props">
            {{ formatDateplusoneSlim(props.row.dia) }}
          </q-td>
        </template>

        <template v-slot:body-cell-telefono="props">
          <q-td :props="props">
            {{ formatPhoneNumber(props.row.prospect.telefono) }}
          </q-td>
        </template>

        <template v-slot:body-cell-ubicacion="props">
          <q-td :props="props">
            {{
              props.row.ubicacion && props.row.ubicacion.length > 40
                ? props.row.ubicacion.slice(0, 40) + "..."
                : props.row.ubicacion
            }}
            <q-tooltip
              class="bg-purple text-body2"
              v-if="props.row.ubicacion && props.row.ubicacion.length > 40"
            >
              {{ props.row.ubicacion }}
            </q-tooltip>
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
    <q-card style="width: 100%">
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">Agendar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Agendar" color="blue" @click="postRow" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <visiti-form ref="add" />
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
    <q-card style="width: 100%">
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
          <q-btn label="Borrar" color="orange" @click="deleteRow" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <visiti-form ref="edit" :visit="selectedRow" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest, dataIncomplete, checkRole } from "src/boot/functions";
import {
  formatDateplusoneSlim,
  formatPhoneNumber,
} from "src/boot/formatFunctions";

import VisitiForm from "src/components/Visits/VisitiForm.vue";

const rows = ref([]);
const selectedRow = ref(null);
const add = ref(null);
const showAdd = ref(false);
const edit = ref(null);
const showEdit = ref(false);

const filterEmpleados = ref(null);

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);

const empleados = ref([]);

const filterForm = ref({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  empleado_id: null,
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
    field: "empleado",
    label: "Empleado",
  },
  {
    name: "dia",
    align: "left",
    field: "dia",
    label: "Dia",
  },
  {
    name: "cliente",
    align: "left",
    field: "cliente",
    label: "Cliente",
  },
  {
    name: "ubicacion",
    align: "left",
    field: "ubicacion",
    label: "Ubicacion",
  },
  {
    name: "telefono",
    align: "left",
    field: "telefono",
    label: "Telefono",
  },
];

const openEdit = (item) => {
  selectedRow.value = item;
  showEdit.value = true;
};

const getRows = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/visits", "");
  rows.value = res.data;
  filterForm.value.page = res.current_page;
  next_page_url.value = res.next_page_url;
  prev_page_url.value = res.prev_page_url;
  last_page.value = res.last_page;
};

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/visit/forms", "");
  empleados.value = res.empleados;
};

const postRow = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formVisit,
  };
  let res = await sendRequest("POST", final, "/api/visit", "");
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
    ...edit.value.formVisit,
  };
  let res = await sendRequest("PUT", final, "/api/visit/" + final.id, "");
  showEdit.value = false;
  getRows(current_page.value);
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/visit/" + selectedRow.value.id,
    ""
  );
  selectedRow.value = null;
  showEdit.value = false;
  getRows();
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

onMounted(() => {
  getRows();
  getForms();
});

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
