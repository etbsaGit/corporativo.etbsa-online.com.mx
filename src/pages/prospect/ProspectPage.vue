<template>
  <q-item>
    <q-item-section>
      <q-input
        outlined
        dense
        label="Buscar"
        v-model="filterForm.search"
        @update:model-value="onInputChange"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-item-section>
    <q-item-section v-if="checkSucursal('Corporativo')">
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
        label="Agendar prospecto"
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
        title="Prospectos"
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

        <template v-slot:body-cell-telefono="props">
          <q-td :props="props">
            {{ formatPhoneNumber(props.row.telefono) }}
          </q-td>
        </template>

        <template v-slot:body-cell-candidato_agp="props">
          <q-td :props="props">
            {{ props.row.candidato_agp == 1 ? "Candidato" : "No es candidato" }}
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
      <q-item>
        <q-item-section>
          <prospect-form ref="add" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEdit"
    transition-show="rotate"
    transition-hide="rotate"
    full-width
  >
    <q-card>
      <q-item class="text-white bg-primary">
        <q-item-section>
          <q-item-label class="text-h6">{{ selectedRow.nombre }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            label="Cerrar"
            color="red"
            v-close-popup
            @click="getRows(current_page)"
          />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <prospect-all-form ref="edit" :prospect="selectedRow" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import {
  sendRequest,
  dataIncomplete,
  checkRole,
  checkSucursal,
} from "src/boot/functions";

import { formatPhoneNumber } from "src/boot/formatFunctions";

import ProspectForm from "src/components/Prospect/ProspectForm.vue";
import ProspectAllForm from "src/components/Prospect/ProspectAllForm.vue";

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

const empleados = ref([]);
const filterEmpleados = ref(null);

const filterForm = ref({
  search: null,
  empleado_id: null,
});

const columns = [
  {
    name: "edit",
    align: "left",
    field: "edit",
  },
  {
    name: "nombre",
    align: "left",
    field: "nombre",
    label: "Nombre",
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
  {
    name: "candidato_agp",
    align: "left",
    field: "candidato_agp",
    label: "Candidato AG",
  },
  {
    name: "empleado",
    align: "left",
    field: "empleado",
    label: "Empleado",
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
  let res = await sendRequest("POST", final, "/api/prospects", "");
  rows.value = res.data;
  filterForm.value.page = res.current_page;
  next_page_url.value = res.next_page_url;
  prev_page_url.value = res.prev_page_url;
  last_page.value = res.last_page;
};

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/prospect/forms", "");
  empleados.value = res.empleados;
};

const postRow = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formProspect,
  };
  let res = await sendRequest("POST", final, "/api/prospect", "");
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
    ...edit.value.formProspect,
  };
  let res = await sendRequest("PUT", final, "/api/prospect/" + final.id, "");
  showEdit.value = false;
  getRows(current_page.value);
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/prospect/" + selectedRow.value.id,
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
</script>
