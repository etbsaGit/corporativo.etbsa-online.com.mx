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
    <q-item-section side>
      <q-btn
        dense
        label="Agregar"
        color="primary"
        @click="openCreate"
        icon="add_circle"
      />
    </q-item-section>
  </q-item>

  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        title="Competencias"
        :rows="rows"
        :columns="columns"
        row-key="nombre"
        dense
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-nombre="props">
          <q-td>
            <q-item dense>
              <q-item-section avatar>
                <q-btn
                  dense
                  color="red"
                  flat
                  icon="delete"
                  @click="openDelete(props.row)"
                />
              </q-item-section>
              <q-item-section avatar>
                <q-btn
                  dense
                  color="blue"
                  flat
                  icon="edit_square"
                  @click="openEdit(props.row)"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ props.row.nombre }}
                </q-item-label>
              </q-item-section>
            </q-item>
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
      <competencia-form ref="add" />
    </template>
  </BaseDialog>

  <BaseDialog v-model="showEdit" mode="edit" @submit="putRow">
    <template #form>
      <competencia-form ref="edit" :competencia="selectedRow" />
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
import CompetenciaForm from "src/components/Competencias/CompetenciaForm.vue";

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
});

const columns = [
  {
    name: "nombre",
    align: "left",
    field: "nombre",
    label: "Nombre",
  },
];

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
  let res = await sendRequest("POST", final, "/api/competencias", "");
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
    ...add.value.formCompetencia,
  };
  let res = await sendRequest("POST", final, "/api/competencia", "");
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
    ...edit.value.formCompetencia,
  };
  let res = await sendRequest("PUT", final, "/api/competencia/" + final.id, "");
  showEdit.value = false;
  getRows(current_page.value);
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/competencia/" + selectedRow.value.id,
    ""
  );
  selectedRow.value = null;
  showDelete.value = false;
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

onMounted(() => {
  getRows();
});
</script>
