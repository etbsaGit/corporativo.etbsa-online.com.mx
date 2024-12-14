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
        v-model="filterForm.rental_machine_id"
        :options="machines"
        label="Buscar por # de serie de la maquina"
        option-value="id"
        option-label="model"
        option-disable="inactive"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        outlined
        dense
        @update:model-value="onInputChange"
      />
    </q-item-section>
    <q-item-section side>
      <q-btn
        dense
        label="Agregar renta"
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
        title="Renta"
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

        <template v-slot:body-cell-document="props">
          <q-td :props="props">
            <q-avatar
              v-if="props.row.doc"
              icon="description"
              @click="openWindow(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-cliente="props">
          <q-td :props="props">
            <q-item>
              <q-item-section>
                <q-item-label>
                  {{ props.row.cliente.nombre }}
                </q-item-label>
                <q-item-label>
                  {{ formatPhoneNumber(props.row.cliente.telefono) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
        </template>

        <template v-slot:body-cell-rental_value="props">
          <q-td :props="props">
            {{ formatCurrency(props.row.rental_value) }}
          </q-td>
        </template>

        <template v-slot:body-cell-start_date="props">
          <q-td :props="props">
            {{ formatDateplusoneSlim(props.row.start_date) }}
          </q-td>
        </template>

        <template v-slot:body-cell-end_date="props">
          <q-td :props="props">
            {{ formatDateplusoneSlim(props.row.end_date) }}
          </q-td>
        </template>

        <template v-slot:body-cell-billing_day="props">
          <q-td :props="props">
            <q-chip
              class="glossy"
              icon="mail"
              :label="getDaysUntilInvoice(props.row.billing_day)"
              clickable
              @click="sendMail(props.row.id)"
            >
              <q-tooltip class="text-h6">
                Enviar notificación para factura
              </q-tooltip>
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-maquina="props">
          <q-td :props="props">
            <q-item>
              <q-item-section>
                <q-item-label>
                  {{ props.row.rental_machine.model }}
                </q-item-label>
                <q-item-label>
                  {{ props.row.rental_machine.serial }}
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
          <rental-period-form ref="add" />
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
          <rental-period-form ref="edit" :rentalPeriod="selectedRow" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";
import {
  formatCurrency,
  formatPhoneNumber,
  formatDateplusoneSlim,
} from "src/boot/formatFunctions";

import RentalPeriodForm from "src/components/RentalPeriods/RentalPeriodForm.vue";

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

const machines = ref([]);

const filterForm = ref({
  search: null,
  rental_machine_id: null,
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
    name: "start_date",
    align: "left",
    field: "start_date",
    label: "Fecha inicio",
  },
  {
    name: "end_date",
    align: "left",
    field: "end_date",
    label: "Fecha Termino",
  },
  {
    name: "billing_day",
    align: "left",
    field: "billing_day",
    label: "Dia para facturacion",
  },
  {
    name: "rental_value",
    align: "left",
    field: "rental_value",
    label: "Valor de renta",
  },
  {
    name: "cliente",
    align: "left",
    field: "cliente",
    label: "Cliente",
  },
  {
    name: "maquina",
    align: "left",
    field: "maquina",
    label: "Maquina",
  },
  {
    name: "document",
    align: "left",
    field: "document",
    label: "Contrato",
  },
];

const openEdit = (item) => {
  selectedRow.value = item;
  showEdit.value = true;
};

const openWindow = (item) => {
  window.open(item.doc, "_blank");
};

const getRows = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/rentalPeriods", "");
  rows.value = res.data;
  filterForm.value.page = res.current_page;
  next_page_url.value = res.next_page_url;
  prev_page_url.value = res.prev_page_url;
  last_page.value = res.last_page;
};

const getMachines = async () => {
  let res = await sendRequest("GET", null, "/api/rentalMachines/all", "");
  machines.value = res.rentalMachines;
};

const sendMail = async (id) => {
  let res = await sendRequest("GET", null, "/api/rentalPeriods/mail/" + id, "");
};

const postRow = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formPeriod,
  };
  let res = await sendRequest("POST", final, "/api/rentalPeriod", "");
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
    ...edit.value.formPeriod,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/rentalPeriod/" + final.id,
    ""
  );
  showEdit.value = false;
  getRows(current_page.value);
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/rentalPeriod/" + selectedRow.value.id,
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

const getDaysUntilInvoice = (invoiceDay) => {
  const today = new Date(); // Fecha actual
  const currentYear = today.getFullYear(); // Año actual
  const currentMonth = today.getMonth(); // Mes actual

  // Crear la fecha de facturación con el día proporcionado
  let invoiceDate = new Date(currentYear, currentMonth, invoiceDay);

  // Si la fecha de factura ya pasó en este mes, se establece para el próximo mes
  if (invoiceDate < today) {
    invoiceDate = new Date(currentYear, currentMonth + 1, invoiceDay);
  }

  // Calcular la diferencia en milisegundos
  const diffTime = invoiceDate - today;

  // Convertir la diferencia a días
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Si no hay diferencia, significa que es hoy
  if (diffDays === 0) {
    return "Hoy";
  }

  // Devolver los días que faltan
  return diffDays + " dias";
};

onMounted(() => {
  getRows();
  getMachines();
});
</script>
