<template>
  <q-item>
    <q-item-section>
      <q-table
        flat
        bordered
        title="Mis solicitudes de vacaciones"
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

        <template v-slot:body-cell-fecha_regreso="props">
          <q-td :props="props">
            {{ formatDateplusoneSlim(props.row.fecha_regreso) }}
          </q-td>
        </template>

        <template v-slot:body-cell-validated="props">
          <q-td :props="props">
            <q-chip
              v-if="props.row.validated == 0"
              color="red"
              text-color="white"
              icon="disabled_by_default"
              label="No autorizada"
            />
            <q-chip
              v-if="props.row.validated == 1"
              color="green"
              text-color="white"
              icon="check_box"
              label="Autorizada"
            />
            <q-chip
              v-if="props.row.validated == null"
              color="orange"
              text-color="white"
              icon="check_box_outline_blank"
              label="Pendiente"
            />
            <q-tooltip class="bg-purple text-body2">
              {{ props.row.comentarios }}
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
          <vacation-form ref="add" />
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
          <q-btn label="Actualizar" color="blue" @click="putRow" />
        </q-item-section>
        <q-item-section side>
          <q-btn label="Borrar" color="orange" @click="deleteRow" />
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section>
          <vacation-form ref="edit" :vacation="selectedRow" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";
import { formatDateplusoneSlim } from "src/boot/formatFunctions";

import VacationForm from "src/components/Vacation/VacationForm.vue";

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
    field: "empleado",
    label: "Empleado",
  },
  {
    name: "anios_cumplidos",
    align: "left",
    field: "anios_cumplidos",
    label: "Años cumplidos",
  },
  {
    name: "dias_disfrute",
    align: "left",
    field: "dias_disfrute",
    label: "Dias",
  },
  {
    name: "fecha_inicio",
    align: "left",
    field: "fecha_inicio",
    label: "Fecha inicio",
  },
  {
    name: "fecha_termino",
    align: "left",
    field: "fecha_termino",
    label: "Fecha Termino",
  },
  {
    name: "fecha_regreso",
    align: "left",
    field: "fecha_regreso",
    label: "Fecha Regreso",
  },
  {
    name: "validated",
    align: "left",
    field: "validated",
    label: "Autorizado",
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
  let res = await sendRequest("POST", final, "/api/vacationDays/auth", "");
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
    ...add.value.formVacation,
  };
  let res = await sendRequest("POST", final, "/api/vacationDay", "");
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
    ...edit.value.formVacation,
  };
  let res = await sendRequest("PUT", final, "/api/vacationDay/" + final.id, "");
  showEdit.value = false;
  getRows(current_page.value);
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/vacationDay/" + selectedRow.value.id,
    ""
  );
  selectedRow.value = null;
  showEdit.value = false;
  getRows();
};

onMounted(() => {
  getRows();
});
</script>
