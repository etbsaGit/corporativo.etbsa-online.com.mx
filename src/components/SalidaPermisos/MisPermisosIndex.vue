<template>
  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        title="Permisos 2 horas"
        :rows="rows"
        :columns="columns"
        row-key="name"
        dense
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-edit="props">
          <q-td :props="props">
            <q-btn
              v-if="props.row.status == null || checkRole('RRHH')"
              dense
              color="red"
              flat
              icon="delete"
              @click="openDelete(props.row)"
            />
            <q-btn
              v-if="props.row.status == null || checkRole('RRHH')"
              dense
              color="blue"
              flat
              icon="edit_square"
              @click="openEdit(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="getDropdownProps(props.row.status).color"
              :text-color="getDropdownProps(props.row.status).textColor"
              :icon="getDropdownProps(props.row.status).icon"
              :label="getDropdownProps(props.row.status).label"
            />
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

  <q-page-sticky position="bottom-right" :offset="[50, 50]">
    <q-btn fab icon="add" color="blue" @click="showAdd = true">
      <q-tooltip
        class="bg-blue text-body2"
        :offset="[10, 10]"
        anchor="center left"
        self="center right"
      >
        Crear solicitud
      </q-tooltip>
    </q-btn>
  </q-page-sticky>

  <BaseDialog v-model="showAdd" mode="create" @submit="postRow">
    <template #form>
      <permiso-form ref="add" />
    </template>
  </BaseDialog>

  <BaseDialog v-model="showEdit" mode="edit" @submit="putRow">
    <template #form>
      <permiso-form ref="edit" :permiso="selectedRow" />
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
import { formatDateplusoneSlim } from "src/boot/formatFunctions";

import BaseDialog from "src/bases/BaseDialog.vue";
import PermisoForm from "src/components/SalidaPermisos/PermisoForm.vue";

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
    label: "Empleado",
    field: (row) => row.empleado.nombreCompleto,
  },
  {
    name: "date",
    align: "left",
    label: "Dia",
    field: (row) => formatDateplusoneSlim(row.date),
  },
  {
    name: "horas",
    align: "left",
    label: "Inicio - Termino",
    field: (row) =>
      mergeHours(row.start, row.end, row.lunch_start, row.lunch_end),
  },
  {
    name: "created_at",
    align: "left",
    label: "Creacion",
    field: (row) => formatDateplusoneSlim(row.created_at),
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
  let res = await sendRequest("POST", final, "/api/salidaPermisos/auth", "");
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
    ...add.value.formPermiso,
  };
  let res = await sendRequest("POST", final, "/api/salidaPermiso", "");
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
    ...edit.value.formPermiso,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/salidaPermiso/" + final.id,
    ""
  );
  showEdit.value = false;
  getRows(current_page.value);
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/salidaPermiso/" + selectedRow.value.id,
    ""
  );
  selectedRow.value = null;
  showDelete.value = false;
  getRows();
};

watch(current_page, (newPage) => {
  getRows(newPage);
});

function getDropdownProps(status) {
  if (status === 0) {
    return {
      color: "red",
      textColor: "white",
      icon: "disabled_by_default",
      label: "No autorizada",
    };
  } else if (status === 1) {
    return {
      color: "green",
      textColor: "white",
      icon: "check_box",
      label: "Autorizada",
    };
  } else {
    return {
      color: "orange",
      textColor: "white",
      icon: "check_box_outline_blank",
      label: "Pendiente",
    };
  }
}

function formatHour(time) {
  if (!time) return "";
  try {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return time; // por si el formato no es HH:mm
  }
}

function mergeHours(start, end, lunch_start, lunch_end) {
  if (!start || !end) return "";

  // Normalizar formato
  const s = formatHour(start);
  const e = formatHour(end);
  const ls = lunch_start ? formatHour(lunch_start) : null;
  const le = lunch_end ? formatHour(lunch_end) : null;

  // Comparar sin formato (para saber si se tocan)
  const normalize = (t) => t?.slice(0, 5); // "08:00"
  const sRaw = normalize(start);
  const eRaw = normalize(end);
  const lsRaw = normalize(lunch_start);
  const leRaw = normalize(lunch_end);

  // Caso 1: si termina justo cuando empieza el almuerzo
  if (eRaw === lsRaw) {
    return `${s} - ${le}`;
  }

  // Caso 2: si empieza justo cuando termina el almuerzo
  if (leRaw === sRaw) {
    return `${ls} - ${e}`;
  }

  // Caso 3: si no se tocan y hay horario de almuerzo definido
  if (ls && le) {
    return `${s} - ${e}, ${ls} - ${le}`;
  }

  // Caso base
  return `${s} - ${e}`;
}

onMounted(() => {
  getRows();
});
</script>
