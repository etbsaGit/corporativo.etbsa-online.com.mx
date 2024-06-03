<template>
  <q-item>
    <q-item-section>
      <q-select
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
      />
    </q-item-section>
    <q-item-section>
      <q-select
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
      />
    </q-item-section>
    <q-item-section class="col-1">
      <q-btn></q-btn>
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
      </q-table>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { sendRequest } from "src/boot/functions";

const employees = ref([]);

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

const getKardex = async () => {
  let res = await sendRequest("GET", null, "/api/event/kardex/get", "");
  employees.value = res;
};

onMounted(() => {
  getKardex();
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

