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
    <q-tab name="visits" label="Visitas" />
    <q-tab name="calendar" label="Calendario" />
    <q-tab name="kardex" label="Kardex" v-if="checkRole('Admin')" />
    <q-tab
      name="report"
      label="Reportes"
      v-if="
        checkPuesto('Gerente corporativo') ||
        checkRole('Admin') ||
        checkRole('Visits')
      "
    />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="visits" class="q-pa-none">
      <visit-index />
    </q-tab-panel>

    <q-tab-panel name="calendar" class="q-pa-none">
      <q-item>
        <q-item-section>
          <visit-calendar />
        </q-item-section>
      </q-item>
    </q-tab-panel>

    <q-tab-panel name="kardex" class="q-pa-none">
      <visit-kardex />
    </q-tab-panel>

    <q-tab-panel name="report" class="q-pa-none">
      <visit-report />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref } from "vue";

import VisitCalendar from "src/components/Visits/VisitCalendar.vue";
import VisitIndex from "src/components/Visits/VisitIndex.vue";
import VisitKardex from "src/components/Visits/VisitKardex.vue";
import VisitReport from "src/components/Visits/VisitReport.vue";
import { checkPuesto, checkRole } from "src/boot/functions";

const tab = ref("visits");
</script>
