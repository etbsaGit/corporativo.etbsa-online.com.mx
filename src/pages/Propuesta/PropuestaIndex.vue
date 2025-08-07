<template>
  <BaseDialog
    v-model="showFilters"
    full-width
    position="top"
    transitionShow="slide-down"
    transitionHide="slide-up"
    mode="filters"
    @submit="getRows"
  >
    <template #form>
      <q-item>
        <q-item-section>
          <q-input outlined dense label="Buscar" v-model="filterForm.search">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
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
            outlined
            dense
            options-dense
            clearable
          />
        </q-item-section>
        <!-- <q-item-section>
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
            outlined
            dense
            options-dense
            clearable
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.category_id"
            :options="categories"
            label="Categoria"
            option-value="id"
            option-label="name"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            outlined
            dense
            options-dense
            clearable
          />
        </q-item-section> -->
        <q-item-section>
          <q-select
            v-model="filterForm.estatus_id"
            :options="estatus"
            label="Tipo"
            option-value="id"
            option-label="nombre"
            option-disable="inactive"
            emit-value
            map-options
            transition-show="jump-up"
            transition-hide="jump-up"
            outlined
            dense
            options-dense
            clearable
          />
        </q-item-section>
      </q-item>
    </template>
  </BaseDialog>

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
          <strong>Propuestas de campaña</strong>
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
              outline
              round
              color="primary"
              icon="fa-solid fa-filter"
              @click="showFilters = true"
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
          <q-td
            :props="props"
            v-if="props.row.created_by === user.id || checkRole('authProp')"
          >
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

        <template v-slot:body-cell-pic="props">
          <q-td>
            <q-avatar
              rounded
              color="primary"
              text-color="white"
              v-if="props.row.pic"
            >
              <img
                :src="props.row.pic"
                alt="pic"
                @click="openDocument(props.row.pic)"
              />
            </q-avatar>
            <q-avatar v-else color="primary" text-color="white">
              <q-icon name="fa-solid fa-image" />
            </q-avatar>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="getDropdownPropsStatus(props.row.estatus).color"
              :label="getDropdownPropsStatus(props.row.estatus).label"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-created_by="props">
          <q-td :props="props">
            {{
              props.row.creador.empleado?.nombreCompleto ||
              props.row.creador.email
            }}
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

        <template v-slot:body-cell-estatus="props">
          <q-td :props="props">
            {{ props.row.estatus?.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-category="props">
          <q-td :props="props">
            {{ props.row.category?.name }}
          </q-td>
        </template>

        <template v-slot:body-cell-created_at="props">
          <q-td :props="props">
            {{ formatDateSlim(props.row.created_at) }}
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
      <propuesta-form ref="add" />
    </template>
  </BaseDialog>

  <BaseDialog fullWidth v-model="showEdit" mode="edit" @submit="putRow">
    <template #form>
      <propuesta-form ref="edit" :propuesta="selectedRow" />
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
import { useAuthStore } from "src/stores/auth";

import BaseDialog from "src/bases/BaseDialog.vue";
import PropuestaForm from "src/components/Propuesta/PropuestaForm.vue";
import { formatDateSlim } from "src/boot/formatFunctions";

const authStore = useAuthStore();
const user = authStore.authUser;

const rows = ref([]);
const selectedRow = ref(null);
const add = ref(null);
const showAdd = ref(false);
const edit = ref(null);
const showEdit = ref(false);
const showFilters = ref(false);
const showDelete = ref(false);

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);

const departamentos = ref([]);
const lineas = ref([]);
const categories = ref([]);
const estatus = ref([]);

const filterForm = ref({
  search: null,
  departamento_id: null,
  linea_id: null,
  category_id: null,
  estatus_id: null,
});

const columns = [
  {
    name: "edit",
    align: "left",
    field: "edit",
    label: "Borrar / Editar",
  },
  {
    name: "pic",
    align: "left",
    field: "pic",
    label: "Foto",
  },
  {
    name: "title",
    align: "left",
    field: "title",
    label: "Titulo",
  },
  {
    name: "status",
    align: "left",
    field: "status",
    label: "Estatus",
  },
  {
    name: "estatus",
    align: "left",
    field: "estatus",
    label: "Tipo",
  },
  // {
  //   name: "linea",
  //   align: "left",
  //   field: "linea",
  //   label: "Linea",
  // },
  // {
  //   name: "category",
  //   align: "left",
  //   field: "category",
  //   label: "Categoria",
  // },
  {
    name: "departamento",
    align: "left",
    field: "departamento",
    label: "Departamento",
  },
  {
    name: "created_by",
    align: "left",
    field: "created_by",
    label: "Autor",
  },
  {
    name: "created_at",
    align: "left",
    field: "created_at",
    label: "Creacion",
  },
  {
    name: "auth",
    align: "left",
    field: "auth",
    label: "Validado por:",
  },
  {
    name: "auth_at",
    align: "left",
    field: "auth_at",
    label: "Validado el dia:",
  },
];

const visibleColumns = ref([
  "edit",
  "pic",
  "title",
  "status",
  "estatus",
  // "linea",
  // "category",
  "departamento",
  "created_by",
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

const getForms = async () => {
  let res = await sendRequest("GET", null, "/api/propuesta/forms", "");
  lineas.value = res.lineas;
  departamentos.value = res.departamentos;
  categories.value = res.categories;
  estatus.value = res.estatus;
};

const getRows = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/propuestas", "");
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
    ...add.value.formPropuesta,
  };
  let res = await sendRequest("POST", final, "/api/propuesta", "");
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
    ...edit.value.formPropuesta,
  };
  let res = await sendRequest("PUT", final, "/api/propuesta/" + final.id, "");
  showEdit.value = false;
  getRows(current_page.value);
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/propuesta/" + selectedRow.value.id,
    ""
  );
  selectedRow.value = null;
  showDelete.value = false;
  getRows();
};

const openDocument = (url) => {
  window.open(url, "_blank");
};

function getDropdownPropsStatus(validated) {
  if (validated === 0) {
    return {
      color: "red-3",
      label: "Rechazada",
    };
  } else if (validated === 1) {
    return {
      color: "green-3",
      label: "Autorizada",
    };
  } else {
    return {
      color: "grey-5",
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
  getForms();
});
</script>
