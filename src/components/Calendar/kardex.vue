<template>
  <q-item>
    <q-item-section>
      <q-select
        v-model="mes"
        :options="months"
        label="Mes"
        option-value="id"
        option-label="name"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        filled
        dense
        hint
      />
    </q-item-section>
    <q-item-section>
      <q-select
        v-model="anio"
        :options="years"
        label="Año"
        option-value="id"
        option-label="name"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        filled
        dense
        :rules="[(val) => val !== null || 'Obligatorio']"
      >
        <template v-slot:after>
          <q-btn
            flat
            icon="search"
            label="Buscar"
            color="primary"
            @click="getKardex(mes, anio)"
          />
        </template>
      </q-select>
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <q-table
        separator="cell"
        :rows="formattedData"
        :columns="columns"
        row-key="empleado"
        :rows-per-page-options="[0]"
        dense
      >
        <template v-slot:top>
          <q-space />
          <q-btn
            dense
            icon-right="archive"
            color="primary"
            label="Export to csv"
            @click="exportTableCSV(columns, formattedData)"
          />
        </template>
        <template v-slot:body-cell-show="props">
          <q-td :props="props">
            <q-btn
              flat
              dense
              color="primary"
              icon="pageview"
              @click="clickRow(props.row.eventos)"
            />
          </q-td>
        </template>
      </q-table>
    </q-item-section>
  </q-item>

  <q-dialog
    v-model="openDialog"
    transition-show="rotate"
    transition-hide="rotate"
    persistent
    full-height
  >
    <q-card style="width: 600px">
      <q-card-section
        class="bg-primary text-white d-flex justify-between items-center q-pa-sm"
      >
        <q-item>
          <q-item-section>
            <div class="text-h6">Eventos</div>
          </q-item-section>
          <q-item-section side>
            <q-item>
              <q-item-section>
                <q-btn dense label="Cerrar" color="red" v-close-popup />
              </q-item-section>
            </q-item>
          </q-item-section>
        </q-item>
      </q-card-section>
      <q-separator />
      <q-card class="q-pa-none scroll" flat>
        <div>
          <kardex-events :key="selectedEvents" :events="selectedEvents" />
        </div>
      </q-card>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { sendRequest } from "src/boot/functions";
import { useQuasar } from "quasar";
import { exportTableCSV } from "src/boot/exportData";
import KardexEvents from "src/components/Calendar/KardexEvents.vue";

const $q = useQuasar();

const selectedEvents = ref(null);
const openDialog = ref(false);

const employees = ref([]);
const mes = ref(new Date().getMonth() + 1); // getMonth() devuelve el mes 0-11, por eso sumamos 1
const anio = ref(new Date().getFullYear());

// Computar todas las sucursales únicas
const allBranches = computed(() => {
  return [
    ...new Set(
      employees.value.flatMap((emp) => emp.sucursales.map((suc) => suc.nombre))
    ),
  ];
});

// Computar los datos formateados
const formattedData = computed(() => {
  return employees.value.map((emp) => {
    const employeeData = { empleado: emp.empleado };

    employeeData["eventos"] = [];
    emp.sucursales.map((suc) => {
      employeeData["eventos"].push(...suc.eventos);
    });

    allBranches.value.forEach((branch) => {
      const branchData = emp.sucursales.find((suc) => suc.nombre === branch);
      employeeData[branch] = branchData ? branchData.conteo : 0;
    });
    return employeeData;
  });
});

// Computar las columnas para la tabla
const columns = computed(() => {
  const cols = [
    {
      name: "empleado",
      label: "Empleado",
      field: "empleado",
      align: "left",
      sortable: true,
    },
  ];

  allBranches.value.forEach((branch) => {
    cols.push({
      name: branch,
      label: branch,
      field: branch,
      align: "center",
      sortable: true,
    });
  });
  cols.push({
    name: "show",
    label: "show",
    field: "show",
    align: "center",
    sortable: true,
  });

  return cols;
});

const getKardex = async (mes = null, anio = null) => {
  if (anio === null) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Seleccione un año",
    });
    return;
  }
  let url;
  if (mes === null) {
    url = `/api/event/kardex/get/${anio}`;
  } else {
    url = `/api/event/kardex/get/${anio}/${mes}`;
  }
  let res = await sendRequest("GET", null, url, "");
  employees.value = res;
};

const clickRow = (events) => {
  openDialog.value = true;
  selectedEvents.value = events;
  console.log(selectedEvents.value);
};

onMounted(() => {
  getKardex(mes.value, anio.value);
});

// JSON

const months = [
  { id: 1, name: "Enero" },
  { id: 2, name: "Febrero" },
  { id: 3, name: "Marzo" },
  { id: 4, name: "Abril" },
  { id: 5, name: "Mayo" },
  { id: 6, name: "Junio" },
  { id: 7, name: "Julio" },
  { id: 8, name: "Agosto" },
  { id: 9, name: "Septiembre" },
  { id: 10, name: "Octubre" },
  { id: 11, name: "Noviembre" },
  { id: 12, name: "Diciembre" },
];

const years = [
  { id: 2020, name: 2020 },
  { id: 2021, name: 2021 },
  { id: 2022, name: 2022 },
  { id: 2023, name: 2023 },
  { id: 2024, name: 2024 },
  { id: 2025, name: 2025 },
  { id: 2026, name: 2026 },
  { id: 2027, name: 2027 },
  { id: 2028, name: 2028 },
  { id: 2029, name: 2029 },
  { id: 2030, name: 2030 },
];
</script>

