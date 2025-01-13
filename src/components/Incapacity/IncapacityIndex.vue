<template>
  <q-item>
    <q-item-section>
      <q-input
        outlined
        dense
        label="Buscar por folio"
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
        label="Registrar incapacidad"
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
        title="Incapacidades"
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

        <template v-slot:body-cell-estatus="props">
          <q-td :props="props">
            {{ props.row.estatus.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-fecha_inicio="props">
          <q-td :props="props">
            {{ formatDateplusoneSlim(props.row.fecha_inicio) }}
          </q-td>
        </template>

        <template v-slot:body-cell-fecha_termino="props">
          <q-td :props="props">
            {{ formatDateplusoneSlim(props.row.fecha_termino) }}
          </q-td>
        </template>

        <template v-slot:body-cell-latestDate="props">
          <q-td :props="props">
            {{ formatDateplusoneSlim(props.row.latestDate) }}
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
    full-width
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
      <q-item>
        <q-item-section>
          <incapacity-form ref="add" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEdit"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    maximized
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
          <q-btn label="Borrar" color="orange" @click="deleteRow" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <incapacity-form ref="edit" :incapacity="selectedRow" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { sendRequest, dataIncomplete, checkRole } from "src/boot/functions";
import { formatDateplusoneSlim } from "src/boot/formatFunctions";

import IncapacityForm from "src/components/Incapacity/IncapacityForm.vue";

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
    name: "folio",
    align: "left",
    field: "folio",
    label: "Folio",
  },
  {
    name: "empleado",
    align: "left",
    field: "empleado",
    label: "Empleado",
  },
  {
    name: "estatus",
    align: "left",
    field: "estatus",
    label: "Ramo de servicio",
  },

  {
    name: "fecha_inicio",
    align: "left",
    field: "fecha_inicio",
    label: "Fecha inicio",
  },
  // {
  //   name: "fecha_termino",
  //   align: "left",
  //   field: "fecha_termino",
  //   label: "Fecha Termino",
  // },
  {
    name: "latestDate",
    align: "left",
    field: "latestDate",
    label: "Fecha Regreso",
  },
  {
    name: "total",
    align: "left",
    field: "total",
    label: "Total dias",
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
  let res = await sendRequest("POST", final, "/api/incapacities", "");
  rows.value = res.data;
  filterForm.value.page = res.current_page;
  next_page_url.value = res.next_page_url;
  prev_page_url.value = res.prev_page_url;
  last_page.value = res.last_page;
};

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/incapacity/forms", "");
  empleados.value = res.empleados;
};

const postRow = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formIncapacity,
  };
  let res = await sendRequest("POST", final, "/api/incapacity", "");
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
    ...edit.value.formIncapacity,
  };
  let res = await sendRequest("PUT", final, "/api/incapacity/" + final.id, "");
  showEdit.value = false;
  getRows(current_page.value);
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/incapacity/" + selectedRow.value.id,
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
