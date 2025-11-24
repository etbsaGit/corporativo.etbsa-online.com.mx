<template>
  <q-tabs
    v-model="tab"
    dense
    class="text-grey"
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
  >
    <q-tab
      v-for="t in visibleTabs"
      :key="t.name"
      :name="t.name"
      :label="t.label"
    />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel
      v-for="t in visibleTabs"
      :key="t.name"
      :name="t.name"
      class="q-pa-none"
    >
      <component :is="t.component" />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref, computed } from "vue";
import MyVacationIndex from "src/components/Vacation/MyVacationIndex.vue";
import VacationAll from "src/components/Vacation/VacationAll.vue";
import VacationCalendar from "src/components/Vacation/VacationCalendar.vue";
import VacationReport from "src/components/Vacation/VacationReport.vue";
import VacationForce from "src/components/Vacation/VacationForce.vue";
import VacationReportEmployee from "src/components/Vacation/VacationReportEmployee.vue";
import { checkRole } from "src/boot/functions";

const tab = ref("myVacation");

// 🔧 Configuración de pestañas (fácil de ampliar)
const allTabs = [
  { name: "myVacation", label: "Mis vacaciones", component: MyVacationIndex },
  { name: "vacationsRH", label: "Vacaciones", component: VacationAll },
  { name: "calendar", label: "Calendario", component: VacationCalendar },
  {
    name: "report",
    label: "Reporte por sucursal",
    component: VacationReport,
    role: "RRHH",
  },
  {
    name: "reportE",
    label: "Reporte por empleado",
    component: VacationReportEmployee,
    role: "RRHH",
  },
  {
    name: "acuenta",
    label: "A cuenta de vacaciones",
    component: VacationForce,
    role: "RRHH",
  },
];

// 🔒 Filtra según el rol
const visibleTabs = computed(() =>
  allTabs.filter((t) => !t.role || checkRole(t.role))
);
</script>
