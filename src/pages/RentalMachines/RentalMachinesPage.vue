<template>
  <q-item>
    <q-item-section>
      <q-input
        outlined
        dense
        label="Buscar por numero de serie"
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
        label="Agregar maquina"
        color="primary"
        @click="showAdd = true"
        icon="add_circle"
      />
    </q-item-section>
    <!-- <q-item-section side>
      <q-btn
        dense
        label="Mostrar borradas"
        color="primary"
        @click="getRowsAll"
      />
    </q-item-section> -->
  </q-item>

  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        title="Maquinas para renta"
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

        <template v-slot:body-cell-picture="props">
          <q-td :props="props">
            <q-avatar
              color="white"
              text-color="white"
              v-if="props.row.pic && props.row.picture"
            >
              <img :src="props.row.pic" alt="Foto de la maquina" />
            </q-avatar>
            <q-avatar v-else color="primary" text-color="white">
              {{ props.row.serial.charAt(0).toUpperCase()
              }}{{ props.row.model.charAt(0).toUpperCase() }}
            </q-avatar>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            {{ getStatusTranslation(props.row.status) }}
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
          <rental-machines-form ref="add" />
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
          <q-item-label class="text-h6">Actualizar</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn label="Cerrar" color="red" v-close-popup />
        </q-item-section>
        <q-item-section side v-if="!selectedRow.deleted_at">
          <q-btn label="Actualizar" color="blue" @click="putRow" />
        </q-item-section>
        <q-item-section side v-if="!selectedRow.deleted_at">
          <q-btn label="Borrar" color="orange" @click="deleteRow" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <rental-machines-form ref="edit" :rentalMachine="selectedRow" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";

import RentalMachinesForm from "src/components/RentalMachines/RentalMachinesForm.vue";

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

const filterForm = ref({
  search: null,
});

const columns = [
  {
    name: "edit",
    align: "left",
    field: "edit",
  },
  {
    name: "picture",
    align: "left",
    field: "picture",
    label: "Foto",
  },

  {
    name: "serial",
    align: "left",
    field: "serial",
    label: "# serie",
  },
  {
    name: "model",
    align: "left",
    field: "model",
    label: "modelo",
  },
  {
    name: "description",
    align: "left",
    field: "description",
    label: "Descripcion",
  },
  {
    name: "hours",
    align: "left",
    field: "hours",
    label: "Horas",
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

const getRows = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/rentalMachines", "");
  rows.value = res.data;
  filterForm.value.page = res.current_page;
  next_page_url.value = res.next_page_url;
  prev_page_url.value = res.prev_page_url;
  last_page.value = res.last_page;
};

const getRowsAll = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/rentalMachines/all", "");
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
    ...add.value.formMachine,
  };
  let res = await sendRequest("POST", final, "/api/rentalMachine", "");
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
    ...edit.value.formMachine,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/rentalMachine/" + final.id,
    ""
  );
  showEdit.value = false;
  getRows(current_page.value);
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/rentalMachine/" + selectedRow.value.id,
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

function getStatusTranslation(status) {
  const translations = {
    available: "Disponible",
    rented: "Rentado",
    maintenance: "En mantenimiento",
  };

  return translations[status] || "Estado desconocido"; // Maneja casos no definidos
}

onMounted(() => {
  getRows();
});
</script>
