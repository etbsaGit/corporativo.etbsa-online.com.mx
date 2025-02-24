<template>
  <q-item>
    <q-item-section>
      <q-input
        outlined
        dense
        label="Buscar nombre, descripcion o numero de serie"
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
        v-model="filterForm.tipo_equipo_id"
        :options="tipos_equipo"
        label="Tipo de equipo"
        option-value="id"
        option-label="name"
        option-disable="inactive"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        outlined
        dense
        @update:model-value="getRows()"
      />
    </q-item-section>
    <q-item-section side>
      <q-select
        v-model="filterForm.status"
        :options="[
          { label: 'Disponible', value: 1 },
          { label: 'En taller', value: 0 },
          { label: 'Todos', value: null },
        ]"
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
        title="Semi-nuevos"
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

        <template v-slot:body-cell-origin="props">
          <q-td :props="props">
            {{ props.row.origin.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-location="props">
          <q-td :props="props">
            {{ props.row.location.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-tipo_equipo="props">
          <q-td :props="props">
            {{ props.row.tipo_equipo.name }}
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            {{ getStatus(props.row.status) }}
          </q-td>
        </template>

        <template v-slot:body-cell-price="props">
          <q-td :props="props">
            {{ formatCurrency(props.row.price) }}
          </q-td>
        </template>

        <template v-slot:body-cell-cost="props">
          <q-td :props="props">
            {{ formatCurrency(props.row.cost) }}
          </q-td>
        </template>

        <template v-slot:body-cell-description="props">
          <q-td :props="props">
            {{
              props.row.description && props.row.description.length > 30
                ? props.row.description.slice(0, 30) + "..."
                : props.row.description
            }}
            <q-tooltip
              class="bg-primary text-body2 text-white"
              v-if="props.row.description && props.row.description.length > 30"
            >
              {{ props.row.description }}
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
      <q-item class="q-pa-none">
        <q-item-section>
          <used-form ref="add" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showEdit"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-width
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
          <q-btn label="Agregar" color="blue" @click="putRow" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <used-form ref="edit" :used="selectedRow" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";

import UsedForm from "src/components/Used/UsedForm.vue";
import { formatCurrency } from "src/boot/formatFunctions";

const rows = ref([]);
const selectedRow = ref(null);
const add = ref(null);
const showAdd = ref(false);
const edit = ref(null);
const showEdit = ref(false);

const tipos_equipo = ref([]);

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);

const filterForm = ref({
  status: 1,
  tipo_equipo_id: null,
  search: null,
});

const columns = [
  {
    name: "edit",
    align: "left",
    field: "edit",
  },
  {
    name: "name",
    align: "left",
    field: "name",
    label: "Nombre",
  },
  {
    name: "description",
    align: "left",
    field: "description",
    label: "Descripcion",
  },
  {
    name: "status",
    align: "left",
    field: "status",
    label: "Status",
  },
  {
    name: "serial",
    align: "left",
    field: "serial",
    label: "# de serie",
  },
  {
    name: "year",
    align: "left",
    field: "year",
    label: "Año",
  },
  {
    name: "hours",
    align: "left",
    field: "hours",
    label: "Horas",
  },
  // {
  //   name: "cost",
  //   align: "left",
  //   field: "cost",
  //   label: "Costo",
  // },
  {
    name: "price",
    align: "left",
    field: "price",
    label: "Precio",
  },
  // {
  //   name: "origin",
  //   align: "left",
  //   field: "origin",
  //   label: "Origen",
  // },
  {
    name: "location",
    align: "left",
    field: "location",
    label: "Ubicacion",
  },
  {
    name: "tipo_equipo",
    align: "left",
    field: "tipo_equipo",
    label: "Tipo de equipo",
  },
];

const openEdit = (item) => {
  selectedRow.value = item;
  showEdit.value = true;
};

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/used/forms", "");
  tipos_equipo.value = res.tipos_equipo;
};

const getRows = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/useds", "");
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
    ...add.value.formUsed,
  };
  let res = await sendRequest("POST", final, "/api/used", "");
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
    ...edit.value.formUsed,
  };
  let res = await sendRequest("PUT", final, "/api/used/" + final.id, "");
  showEdit.value = false;
  getRows(current_page.value);
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/used/" + selectedRow.value.id,
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

const getStatus = (id) => {
  switch (id) {
    case 1:
      return "Disponible";
    case 0:
      return "En taller";
    default:
      return "No disponible";
  }
};

onMounted(() => {
  getRows();
  getForms();
});
</script>
