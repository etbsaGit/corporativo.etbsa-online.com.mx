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
import { useAuthStore } from "src/stores/auth";

import PermisosIndex from "src/components/SalidaPermisos/PermisosIndex.vue";
import MisPermisosIndex from "src/components/SalidaPermisos/MisPermisosIndex.vue";
import PermisosCalendar from "src/components/SalidaPermisos/PermisosCalendar.vue";

import { checkRole } from "src/boot/functions";

const authStore = useAuthStore();
const usuario = authStore.authUser;

const tab = ref("misPermisos");

const allTabs = [
  {
    name: "misPermisos",
    label: "Mis permisos",
    component: MisPermisosIndex,
    show: true,
  },
  {
    name: "permisos",
    label: "Permisos",
    component: PermisosIndex,
    show: usuario.empleado?.hasEmpleados || checkRole("Admin"),
  },
  {
    name: "calendar",
    label: "Calendario",
    component: PermisosCalendar,
    show: true,
  },
];

const visibleTabs = computed(() =>
  allTabs.filter((t) => t.show && (!t.role || checkRole(t.role)))
);
</script>
