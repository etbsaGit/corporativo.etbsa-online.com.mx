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
          <strong>Transacciones</strong>

          <q-space />

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
        </template>

        <template v-slot:body-cell-edit="props">
          <q-td :props="props">
            <q-btn
              v-if="props.row.validado == 0"
              dense
              color="primary"
              flat
              icon="edit_square"
              @click="openEdit(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-tipo_factura="props">
          <q-td :props="props">
            {{ props.row.tipo_factura.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-cliente="props">
          <q-td :props="props">
            {{ props.row.cliente?.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-user="props">
          <q-td :props="props">
            {{ props.row.user.empleado?.nombreCompleto }}
          </q-td>
        </template>

        <template v-slot:body-cell-tipo_pago="props">
          <q-td :props="props">
            {{ props.row.tipo_pago?.nombre }}
          </q-td>
        </template>

        <template v-slot:body-cell-cuenta="props">
          <q-td :props="props">
            <q-item dense>
              <q-item-section>
                <q-item-label>
                  {{ props.row.cuenta?.numeroCuenta }}
                </q-item-label>
                <q-item-label caption>
                  {{ props.row.cuenta?.caja_banco?.nombre }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
        </template>

        <template v-slot:body-cell-total_con_iva="props">
          <q-td :props="props">
            {{ formatCurrency(props.row.total.total_con_iva) }}
          </q-td>
        </template>

        <template v-slot:body-cell-total_sin_iva="props">
          <q-td :props="props">
            {{ formatCurrency(props.row.total.total_sin_iva) }}
          </q-td>
        </template>

        <template v-slot:body-cell-fecha_pago="props">
          <q-td :props="props">
            {{ formatDateplusoneSlim(props.row.fecha_pago) }}
          </q-td>
        </template>

        <template v-slot:body-cell-caja_pagos="props">
          <q-td :props="props">
            <q-icon size="md" name="fa-solid fa-money-check-dollar">
              <q-tooltip class="text-black">
                <caja-pagos-card :pagos="props.row.pagos" />
              </q-tooltip>
            </q-icon>
          </q-td>
        </template>

        <template v-slot:body-cell-validado="props">
          <q-td :props="props">
            <q-chip
              v-if="props.row.validado == 0"
              color="red"
              text-color="white"
              icon="disabled_by_default"
              label="No validado"
            />
            <q-chip
              v-if="props.row.validado == 1"
              color="green"
              text-color="white"
              icon="check_box"
              label="Validado"
            />
          </q-td>
        </template>
      </q-table>
    </q-item-section>
  </q-item>

  <q-page-sticky position="bottom-left" :offset="[50, 50]">
    <q-btn fab icon="add" color="blue" @click="showAdd = true">
      <q-tooltip
        class="bg-blue text-body2"
        :offset="[10, 10]"
        anchor="center left"
        self="center right"
      >
        Agregar transaccion
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
          <caja-transaccion-form ref="add" />
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
          <caja-transaccion-form ref="edit" :transaccion="selectedRow" />
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";

import CajaTransaccionForm from "src/components/Caja/CajaTransaccion/CajaTransaccionForm.vue";
import CajaPagosCard from "src/components/Caja/CajaTransaccion/CajaPagosCard.vue";

import {
  formatCurrency,
  formatDateplusoneSlim,
} from "src/boot/formatFunctions";

const rows = ref([]);
const selectedRow = ref(null);
const add = ref(null);
const showAdd = ref(false);
const edit = ref(null);
const showEdit = ref(false);

const columns = [
  {
    name: "edit",
    align: "left",
    field: "edit",
    label: "Editar",
  },
  {
    name: "factura",
    align: "left",
    field: "factura",
    label: "Factura",
  },
  {
    name: "total_sin_iva",
    align: "left",
    field: "total_sin_iva",
    label: "Total sin IVA",
  },
  {
    name: "total_con_iva",
    align: "left",
    field: "total_con_iva",
    label: "Total con IVA",
  },
  {
    name: "tipo_factura",
    align: "left",
    field: "tipo_factura",
    label: "Tipo de factura",
  },
  {
    name: "folio",
    align: "left",
    field: "folio",
    label: "Folio",
  },
  {
    name: "serie",
    align: "left",
    field: "serie",
    label: "Serie",
  },
  {
    name: "uuid",
    align: "left",
    field: "uuid",
    label: "UUID",
  },
  {
    name: "validado",
    align: "left",
    field: "validado",
    label: "Validado",
  },
  {
    name: "cliente",
    align: "left",
    field: "cliente",
    label: "Cliente",
  },
  {
    name: "user",
    align: "left",
    field: "user",
    label: "Creador",
  },
  {
    name: "fecha_pago",
    align: "left",
    field: "fecha_pago",
    label: "Fecha de pago",
  },
  {
    name: "tipo_pago",
    align: "left",
    field: "tipo_pago",
    label: "Forma de pago",
  },
  {
    name: "cuenta",
    align: "left",
    field: "cuenta",
    label: "Cuenta",
  },
  {
    name: "caja_pagos",
    align: "left",
    field: "caja_pagos",
    label: "Pagos",
  },
];

const visibleColumns = ref([
  "edit",
  "factura",
  "tipo_factura",
  "folio",
  "serie",
  "uuid",
  "validado",
  "cliente",
  "user",
  "caja_pagos",
  "total_sin_iva",
  "total_con_iva",
  "tipo_pago",
  "fecha_pago",
  "cuenta",
]);

const openEdit = (item) => {
  selectedRow.value = item;
  showEdit.value = true;
};

const getRows = async () => {
  let res = await sendRequest("GET", null, "/api/caja/cajaTransaccion/now", "");
  rows.value = res;
};

const postRow = async () => {
  const add_valid = await add.value.validate();
  if (!add_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...add.value.formTransaccion,
  };
  let res = await sendRequest("POST", final, "/api/caja/cajaTransaccion", "");
  showAdd.value = false;
  getRows();
};

const putRow = async () => {
  const edit_valid = await edit.value.validate();
  if (!edit_valid) {
    dataIncomplete();
    return;
  }
  const final = {
    ...edit.value.formTransaccion,
  };
  let res = await sendRequest(
    "PUT",
    final,
    "/api/caja/cajaTransaccion/" + final.id,
    ""
  );
  showEdit.value = false;
  getRows();
};

const deleteRow = async () => {
  let res = await sendRequest(
    "DELETE",
    null,
    "/api/caja/cajaTransaccion/" + selectedRow.value.id,
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
