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
  </q-item>
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
      >
        <template v-slot:top>
          <strong>Candidatos</strong>

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
              v-if="checkRole('RRHH')"
              round
              outline
              color="primary"
              @click="openCreate"
              icon="fa-solid fa-plus"
            />
          </q-item>
        </template>

        <template v-slot:body-cell-edit="props">
          <q-td>
            <q-item dense v-if="checkRole('RRHH')">
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
            </q-item>
          </q-td>
        </template>

        <template v-slot:body-cell-puesto="props">
          <q-td :props="props">
            {{ props.row.requisicion?.puesto?.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-sucursal="props">
          <q-td :props="props">
            {{ props.row.requisicion?.sucursal?.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-telefono="props">
          <q-td :props="props">
            {{ formatPhoneNumber(props.row.telefono) }}
          </q-td>
        </template>

        <template v-slot:body-cell-fecha_entrevista_1="props">
          <q-td :props="props">
            {{ formatDateplusone(props.row.fecha_entrevista_1) }}
          </q-td>
        </template>

        <template v-slot:body-cell-notas="props">
          <q-td :props="props">
            <q-icon
              v-if="props.row.notas[0]"
              name="fa-regular fa-clipboard"
              size="2.5em"
            >
              <q-tooltip>
                <candidato-notas-list :notas="props.row.notas" />
              </q-tooltip>
            </q-icon>
          </q-td>
        </template>

        <template v-slot:body-cell-cv="props">
          <q-td :props="props">
            <q-btn
              v-if="props.row.cvpath"
              flat
              dense
              icon="attach_file"
              color="primary"
              @click="openDocument(props.row.cvpath)"
            />
            <span v-else>-</span>
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

  <BaseDialog fullWidth v-model="showAdd" mode="create" @submit="postRow">
    <template #form>
      <candidato-form ref="add" :requisicion="requisicion" />
    </template>
  </BaseDialog>

  <BaseDialog fullWidth v-model="showEdit" mode="edit" @submit="putRow">
    <template #form>
      <candidato-form
        ref="edit"
        :requisicion="requisicion"
        :candidato="selectedRow"
      />
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
import { sendRequest, dataIncomplete, checkRole } from "src/boot/functions";
import { formatDateplusone, formatPhoneNumber } from "src/boot/formatFunctions";

import BaseDialog from "src/bases/BaseDialog.vue";
import CandidatoForm from "src/components/Candidato/CandidatoForm.vue";
import CandidatoNotasList from "src/components/Candidato/CandidatoNotasList.vue";

const { requisicion } = defineProps(["requisicion"]);

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

const estatuses1 = ref(["Programar entrevista", "Entrevista realizada"]);
const estatuses2 = ref([
  "Pendiente por definir",
  "Solicitar CB",
  "Solicitar ES",
  "En espera de documentacion",
  "Descartado",
  "Contratado",
]);

const filterForm = ref({
  search: null,
  requisicion_id: requisicion ? requisicion.id : null,
});

const columns = [
  {
    name: "edit",
    align: "left",
    field: "edit",
    label: "Borrar / Editar",
  },
  {
    name: "nombre",
    align: "left",
    field: "nombre",
    label: "Nombre",
  },
  {
    name: "telefono",
    align: "left",
    field: "telefono",
    label: "Telefono",
  },
  {
    name: "puesto",
    align: "left",
    field: "puesto",
    label: "Puesto",
  },
  {
    name: "sucursal",
    align: "left",
    field: "sucursal",
    label: "Sucursal",
  },
  {
    name: "status_1",
    align: "left",
    field: "status_1",
    label: "Estatus 1",
  },
  {
    name: "fecha_entrevista_1",
    align: "left",
    field: "fecha_entrevista_1",
    label: "Fecha de entrevista",
  },
  {
    name: "forma_reclutamiento",
    align: "left",
    field: "forma_reclutamiento",
    label: "Forma de reclutamiento",
  },
  {
    name: "status_2",
    align: "left",
    field: "status_2",
    label: "Estatus 2",
  },
  {
    name: "cv",
    align: "left",
    field: "cv",
    label: "CV",
  },
  {
    name: "notas",
    align: "left",
    field: "notas",
    label: "Notas",
  },
];

const visibleColumns = ref([
  "edit",
  "nombre",
  "telefono",
  "puesto",
  "sucursal",
  "status_1",
  "status_2",
  "fecha_entrevista_1",
  "forma_reclutamiento",
  "cv",
  "notas",
]);

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
  let res = await sendRequest("POST", final, "/api/candidatos", "");
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
    ...add.value.formCandidato,
  };
  let res = await sendRequest("POST", final, "/api/candidato", "");
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
    ...edit.value.formCandidato,
  };
  let res = await sendRequest("PUT", final, "/api/candidato/" + final.id, "");
  showEdit.value = false;
  getRows(current_page.value);
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/candidato/" + selectedRow.value.id,
    ""
  );
  selectedRow.value = null;
  showDelete.value = false;
  getRows();
};

const openDocument = (url) => {
  window.open(url, "_blank");
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
