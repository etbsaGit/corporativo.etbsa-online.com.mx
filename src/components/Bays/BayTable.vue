<template>
  <q-table
    flat
    bordered
    :class="getTableClass"
    :title="computedTitle"
    :rows="bays"
    :columns="columns"
    row-key="name"
    dense
    :rows-per-page-options="[0]"
  >
    <template v-slot:body-cell-show="props">
      <q-td :props="props">
        <q-btn dense color="primary" flat icon="preview" />
      </q-td>
    </template>

    <template v-slot:body-cell-wo_machine="props">
      <q-td :props="props">
        {{ props.row.work_order?.maquina }}
      </q-td>
    </template>

    <template v-slot:body-cell-wo_cliente="props">
      <q-td :props="props">
        {{ props.row.work_order?.cliente }}
      </q-td>
    </template>

    <template v-slot:body-cell-wo_estatus="props">
      <q-td :props="props">
        {{ props.row.work_order?.estatus.nombre }}
      </q-td>
    </template>

    <template v-slot:body-cell-wo_fi="props">
      <q-td :props="props">
        {{ props.row.work_order?.fecha_ingreso }}
      </q-td>
    </template>

    <template v-slot:body-cell-wo_fe="props">
      <q-td :props="props">
        {{ props.row.work_order?.fecha_entrega || "No definido" }}
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
const { bays } = defineProps(["bays"]);

import { computed } from "vue";

const computedTitle = computed(() => {
  return bays[0]?.linea.nombre || "Sin Nombre";
});

const columns = [
  {
    name: "show",
    align: "left",
  },
  {
    name: "nombre",
    label: "Nombre",
    align: "left",
    field: "nombre",
    sortable: true,
  },
  {
    name: "wo_machine",
    label: "Maquina",
    align: "left",
    field: "wo_machine",
    sortable: true,
  },
  {
    name: "wo_cliente",
    label: "Cliente",
    align: "left",
    field: "wo_cliente",
    sortable: true,
  },
  {
    name: "wo_estatus",
    label: "Estatus",
    align: "left",
    field: "wo_estatus",
    sortable: true,
  },
  {
    name: "wo_fi",
    label: "Ingreso",
    align: "left",
    field: "wo_fi",
    sortable: true,
  },
  {
    name: "wo_fe",
    label: "Entrega",
    align: "left",
    field: "wo_fe",
    sortable: true,
  },
];

// Función para determinar la clase de la tabla
const getTableClass = computed(() => {
  if (bays.length > 0) {
    const tipo = bays[0].linea_id;
    // Determinar tipo del primer registro
    if (tipo === 1) {
      return "bg-green text-black";
    } else if (tipo === 2) {
      return "bg-yellow text-black";
    }
  }
  return "";
});
</script>

<style>
/* Define los estilos */
.bg-green {
  background-color: #97ff9b !important; /* Verde */
}

.bg-yellow {
  background-color: #fbee7b !important; /* Amarillo */
}
</style>
