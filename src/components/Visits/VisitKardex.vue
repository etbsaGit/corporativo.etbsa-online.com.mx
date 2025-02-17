<template>
  <q-item>
    <q-item-section>
      <q-select
        v-model="formFilter.year"
        :options="years"
        label="Año"
        option-value="id"
        option-label="name"
        emit-value
        map-options
        transition-show="jump-up"
        transition-hide="jump-up"
        clearable
        outlined
        dense
        options-dense
        @update:model-value="getKardex"
      />
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <q-table
        :rows="formattedVisits"
        :columns="columns"
        row-key="id"
        dense
        flat
        bordered
        title="Visitas"
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <template
              v-if="
                props.value &&
                typeof props.value === 'object' &&
                props.value.withFeedback !== undefined &&
                props.value.withoutFeedback !== undefined
              "
            >
              <q-chip
                color="green"
                text-color="white"
                :label="props.value.withFeedback"
              >
                <q-tooltip class="bg-green text-body2" :offset="[10, 10]">
                  Retroalimentadas
                </q-tooltip>
              </q-chip>
              <q-chip
                color="red"
                text-color="white"
                :label="props.value.withoutFeedback"
              >
                <q-tooltip class="bg-red text-body2" :offset="[10, 10]">
                  No retroalimentadas
                </q-tooltip>
              </q-chip>
            </template>
            <template v-else>
              {{ props.value }}
            </template>
          </q-td>
        </template>
      </q-table>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { sendRequest } from "src/boot/functions";

const visits = ref([]);

const formFilter = ref({
  year: new Date().getFullYear(),
});

const columns = computed(() => [
  { name: "nombre", label: "Empleado", field: "nombreCompleto", align: "left" },
  ...months.map((month, index) => ({
    name: month.toLowerCase(),
    label: month,
    field: (row) => row.visitsByMonth[index + 1] || 0,
    align: "center",
  })),
]);

const formattedVisits = computed(() => {
  return visits.value.map((employee) => {
    const visitsByMonth = {};

    employee.visits.forEach((visit) => {
      const month = new Date(visit.dia).getMonth() + 1;
      const feedbackKey = visit.retroalimentacion
        ? "withFeedback"
        : "withoutFeedback";

      if (!visitsByMonth[month]) {
        visitsByMonth[month] = { withFeedback: 0, withoutFeedback: 0 };
      }

      visitsByMonth[month][feedbackKey] += 1;
    });

    return {
      ...employee,
      visitsByMonth,
    };
  });
});

const getKardex = async () => {
  const final = {
    ...formFilter.value,
  };
  let res = await sendRequest("POST", final, "/api/visit/kardex", "");
  visits.value = res;
};

onMounted(() => {
  getKardex();
});

// JSON

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
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
