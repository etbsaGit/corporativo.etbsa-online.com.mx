<template>
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
        :rows-per-page-options="[0]"
      >
        <template v-slot:top>
          <strong>Declaraciones</strong>

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
          <q-td :props="props">
            <q-avatar>
              <q-icon
                color="red"
                name="delete"
                @click="openDelete(props.row)"
              />
            </q-avatar>
            <q-avatar>
              <q-icon
                color="blue"
                name="edit_square"
                @click="openEdit(props.row)"
              />
            </q-avatar>
          </q-td>
        </template>

        <template v-slot:body-cell-cliente="props">
          <q-td :props="props">
            {{ props.row.cliente.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-periodo="props">
          <q-td :props="props">
            {{ formatDateplusoneSlim(props.row.inicio) }} -
            {{ formatDateplusoneSlim(props.row.termino) }}
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-btn-dropdown
              dense
              :color="getDropdownPropsStatus(props.row.status).color"
              :text-color="getDropdownPropsStatus(props.row.status).textColor"
              :icon="getDropdownPropsStatus(props.row.status).icon"
              :label="getDropdownPropsStatus(props.row.status).label"
            >
              <q-list dense>
                <q-item
                  v-if="props.row.status != 1"
                  clickable
                  v-close-popup
                  class="bg-green-6"
                  @click="changeEstatus(props.row.id, 1)"
                >
                  <q-item-section>
                    <q-chip
                      color="green-6"
                      text-color="white"
                      icon="fa-solid fa-check-double"
                      label="Autorizada"
                    />
                  </q-item-section>
                </q-item>

                <q-item
                  v-if="props.row.status != 0"
                  clickable
                  v-close-popup
                  class="bg-red-6"
                  @click="changeEstatus(props.row.id, 0)"
                >
                  <q-item-section>
                    <q-chip
                      color="red-6"
                      text-color="white"
                      icon="fa-solid fa-x"
                      label="Rechazada"
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

  <BaseDialog maximized v-model="showAdd" mode="create" @submit="postRow">
    <template #form>
      <credito-declaracion-form ref="add" />
    </template>
  </BaseDialog>

  <BaseDialog
    maximized
    v-model="showEdit"
    mode="edit"
    @submit="putRow"
    @close="getRows"
  >
    <template #form>
      <credito-declaracion-form ref="edit" :declaracion="selectedRow" />
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
import { sendRequest, dataIncomplete } from "src/boot/functions";

import BaseDialog from "src/bases/BaseDialog.vue";
import CreditoDeclaracionForm from "src/components/Credito/CreditoDeclaracion/CreditoDeclaracionForm.vue";
import { formatDateplusoneSlim } from "src/boot/formatFunctions";
import { checkRole } from "src/boot/functions";

const rows = ref([]);
const selectedRow = ref(null);
const add = ref(null);
const showAdd = ref(false);
const edit = ref(null);
const showEdit = ref(false);
const showDelete = ref(false);

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);

const filterForm = ref({
  search: null,
  cliente_id: null,
});

const columns = [
  {
    name: "edit",
    align: "left",
    field: "edit",
    label: "Borrar / Editar",
  },
  {
    name: "cliente",
    align: "left",
    field: "cliente",
    label: "Cliente",
  },
  {
    name: "giro",
    align: "left",
    field: "giro",
    label: "Giro",
  },
  {
    name: "status",
    align: "left",
    field: "status",
    label: "Status",
  },
  {
    name: "periodo",
    align: "left",
    field: "periodo",
    label: "Periodo",
  },
];

const visibleColumns = ref(["edit", "cliente", "giro", "status", "periodo"]);

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

const getRows = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/creditoDeclaracions", "");
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
    ...add.value.formDeclaracion,
  };
  console.log(final);

  let res = await sendRequest("POST", final, "/api/creditoDeclaracion", "");
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
    ...edit.value.formDeclaracion,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/creditoDeclaracion/" + final.id,
    ""
  );
  showEdit.value = false;
  getRows(current_page.value);
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/creditoDeclaracion/" + selectedRow.value.id,
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
    "/api/creditoDeclaracion/status/" + id + "/" + status,
    ""
  );
  getRows(current_page.value);
};

function getDropdownPropsStatus(status) {
  if (status === 0) {
    return {
      color: "red-6",
      textColor: "white",
      icon: "fa-solid fa-x",
      label: "Rechazada",
    };
  } else if (status === 1) {
    return {
      color: "green-6",
      textColor: "white",
      icon: "fa-solid fa-check-double",
      label: "Autorizada",
    };
  } else {
    return {
      color: "primary",
      textColor: "white",
      icon: "fa-regular fa-hourglass-half",
      label: "Esperando autorizacion",
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
});
</script>
