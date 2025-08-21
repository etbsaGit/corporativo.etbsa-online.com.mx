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
          <q-input
            outlined
            dense
            label="Buscar ..."
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
          <q-select
            v-model="filterForm.empleado_id"
            :options="empleados"
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
            options-dense
            clearable
          />
        </q-item-section>
        <q-item-section>
          <q-select
            v-model="filterForm.vehicle_id"
            :options="vehicles"
            label="Vehiculo"
            option-value="id"
            option-label="placas"
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
          <strong>Solicitudes de servicio</strong>

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
          <q-item v-if="checkRole('cc')">
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
          <q-td :props="props">
            <q-avatar v-if="props.row.status == null">
              <q-icon
                color="red"
                name="delete"
                @click="openDelete(props.row)"
              />
            </q-avatar>
            <q-avatar v-if="props.row.status == null">
              <q-icon
                color="blue"
                name="edit_square"
                @click="openEdit(props.row)"
              />
            </q-avatar>
          </q-td>
        </template>

        <template v-slot:body-cell-vehicle="props">
          <q-td :props="props">
            {{ props.row.vehicle?.estatus?.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-placas="props">
          <q-td :props="props">
            {{ props.row.vehicle?.placas }}
          </q-td>
        </template>

        <template v-slot:body-cell-type="props">
          <q-td :props="props">
            {{ props.row.estatus?.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-empleado="props">
          <q-td :props="props">
            {{ props.row.empleado?.apellidoCompleto }}
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-btn-dropdown
              v-if="checkRole('cc')"
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
                  class="bg-green-3"
                  @click="changeEstatus(props.row.id, 1)"
                >
                  <q-item-section>
                    <q-chip
                      color="green-3"
                      text-color="white"
                      icon="fa-solid fa-circle-check"
                      label="Autorizada"
                    />
                  </q-item-section>
                </q-item>

                <q-item
                  v-if="props.row.status != 0"
                  clickable
                  v-close-popup
                  class="bg-red-3"
                  @click="changeEstatus(props.row.id, 0)"
                >
                  <q-item-section>
                    <q-chip
                      color="red-3"
                      text-color="white"
                      icon="fa-solid fa-circle-xmark"
                      label="Rechazada"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-chip
              v-else
              square
              :color="getDropdownPropsStatus(props.row.estatus).color"
              :text-color="getDropdownPropsStatus(props.row.estatus).textColor"
              :icon="getDropdownPropsStatus(props.row.estatus).icon"
              :label="getDropdownPropsStatus(props.row.estatus).label"
            />
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
      <service-form ref="add" />
    </template>
  </BaseDialog>

  <BaseDialog
    fullWidth
    v-model="showEdit"
    mode="edit"
    @submit="putRow"
    @close="getRows"
  >
    <template #form>
      <service-form ref="edit" :service="selectedRow" />
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

import BaseDialog from "src/bases/BaseDialog.vue";
import ServiceForm from "src/components/Service/ServiceForm.vue";
import { formatDateSlim } from "src/boot/formatFunctions";

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

const estatus = ref([]);
const vehicles = ref([]);
const empleados = ref([]);

const filterForm = ref({
  search: null,
  estatus_id: null,
  vehicle_id: null,
  empleado_id: null,
});

const columns = [
  {
    name: "edit",
    align: "left",
    field: "edit",
    label: "Borrar / Editar",
  },
  {
    name: "vehicle",
    align: "left",
    field: "vehicle",
    label: "Vehiculo",
  },
  {
    name: "placas",
    align: "left",
    field: "placas",
    label: "Placas",
  },
  {
    name: "type",
    align: "left",
    field: "type",
    label: "Tipo",
  },
  {
    name: "empleado",
    align: "left",
    field: "empleado",
    label: "Empleado",
  },
  {
    name: "km",
    align: "left",
    field: "km",
    label: "KM",
  },
  {
    name: "status",
    align: "left",
    field: "status",
    label: "Estatus",
  },
  {
    name: "created_at",
    align: "left",
    field: "created_at",
    label: "Creacion",
  },
  {
    name: "description",
    align: "left",
    field: "description",
    label: "Descripcion",
  },
];

const visibleColumns = ref([
  "edit",
  "vehicle",
  "placas",
  "type",
  "empleado",
  "km",
  "status",
  "created_at",
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
  let res = await sendRequest("GET", null, "/api/service/forms", "");
  empleados.value = res.empleados;
  vehicles.value = res.vehicles;
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
  let res = await sendRequest("POST", final, "/api/services", "");
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
    ...add.value.formService,
  };
  let res = await sendRequest("POST", final, "/api/service", "");
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
    ...edit.value.formService,
  };
  let res = await sendRequest("PUT", final, "/api/service/" + final.id, "");
  showEdit.value = false;
  getRows(current_page.value);
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/service/" + selectedRow.value.id,
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
    "/api/service/status/" + id + "/" + status,
    ""
  );
  getRows(current_page.value);
};

function getDropdownPropsStatus(validated) {
  if (validated === 0) {
    return {
      color: "red-3",
      textColor: "white",
      icon: "fa-solid fa-circle-xmark",
      label: "Rechazada",
    };
  } else if (validated === 1) {
    return {
      color: "green-3",
      textColor: "white",
      icon: "fa-solid fa-circle-check",
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
  getForms();
});
</script>
