<template>
  <q-item dense>
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
  <q-item dense>
    <q-item-section>
      <q-select
        v-model="filterForm.user_id"
        :options="usuarios"
        label="Empleado"
        option-value="id"
        option-label="name"
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
    <q-item-section>
      <q-select
        v-model="filterForm.tipo_factura_id"
        :options="tiposFacturas"
        label="Tipo de factura"
        option-value="id"
        option-label="nombre"
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
    <q-item-section>
      <q-select
        v-model="filterForm.cuenta_id"
        :options="cuentas"
        option-value="id"
        option-label="numeroCuenta"
        label="Cuenta"
        option-disable="inactive"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        outlined
        dense
        behavior="dialog"
        @update:model-value="onInputChange"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              Cuenta: {{ scope.opt.numeroCuenta }}
            </q-item-section>
            <q-item-section>
              Banco: {{ scope.opt.caja_banco?.nombre }}
            </q-item-section>
            <q-item-section>
              Sucursal: {{ scope.opt.sucursal?.nombre }}
            </q-item-section>
            <q-item-section>
              Categoria: {{ scope.opt.categoria?.nombre }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-item-section>
    <q-item-section>
      <q-select
        v-model="filterForm.tipo_pago_id"
        :options="tiposPagos"
        label="Tipo de pago"
        option-value="id"
        option-label="nombre"
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
    <q-item-section>
      <q-select
        v-model="filterForm.validado"
        :options="[
          { id: 1, nombre: 'Validado' },
          { id: 0, nombre: 'No validado' },
        ]"
        label="Validacion"
        option-value="id"
        option-label="nombre"
        option-disable="inactive"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        outlined
        dense
        @update:model-value="onInputChange"
      />
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

        <template v-slot:body-cell-fecha_registro="props">
          <q-td :props="props">
            {{ formatDateSlim(props.row.created_at) }}
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
              :color="props.row.validado == 0 ? 'red' : 'green'"
              text-color="white"
              :icon="
                props.row.validado == 0 ? 'disabled_by_default' : 'check_box'
              "
              :label="props.row.validado == 0 ? 'No validado' : 'Validado'"
              clickable
              @click="changeStatus(props.row)"
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
import { ref, onMounted, watch } from "vue";
import { sendRequest, dataIncomplete } from "src/boot/functions";
import {
  formatCurrency,
  formatDateplusoneSlim,
  formatDateSlim,
} from "src/boot/formatFunctions";

import CajaTransaccionForm from "src/components/Caja/CajaTransaccion/CajaTransaccionForm.vue";

import CajaPagosCard from "src/components/Caja/CajaTransaccion/CajaPagosCard.vue";

const rows = ref([]);
const selectedRow = ref(null);
const add = ref(null);
const showAdd = ref(false);
const edit = ref(null);
const showEdit = ref(false);

const tiposFacturas = ref([]);
const sucursales = ref([]);
const categorias = ref([]);
const cuentas = ref([]);
const tiposPagos = ref([]);
const usuarios = ref([]);

const next_page_url = ref("");
const prev_page_url = ref("");
const last_page = ref(0);
const current_page = ref(1);

const filterForm = ref({
  search: null,
  user_id: null,
  tipo_factura_id: null,
  cuenta_id: null,
  tipo_pago_id: 4,
  validado: 0,
});

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

const getForms = async () => {
  let res = await sendRequest(
    "GET",
    null,
    "/api/caja/cajaTransaccion/forms",
    ""
  );
  // clientes.value = res.clientes;
  tiposFacturas.value = res.tipos_factura;
  // sucursales.value = res.sucursales;
  // categorias.value = res.categorias;
  cuentas.value = res.cuentas;
  tiposPagos.value = res.tipos_pago;
  usuarios.value = res.users;
};

const getRows = async (page = 1) => {
  const current = {
    page: page,
  };
  const final = {
    ...filterForm.value,
    ...current,
  };
  let res = await sendRequest("POST", final, "/api/caja/cajaTransacciones", "");
  rows.value = res.data;
  filterForm.value.page = res.current_page;
  next_page_url.value = res.next_page_url;
  prev_page_url.value = res.prev_page_url;
  last_page.value = res.last_page;
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

const changeStatus = async (row) => {
  let res = await sendRequest(
    "PUT",
    null,
    "/api/caja/cajaTransaccion/validado/" + row.id,
    ""
  );
  getRows(current_page);
};

onMounted(() => {
  getRows();
  getForms();
});
</script>
