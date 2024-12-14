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
    <q-tab name="calendar" label="Calendario" />
    <q-tab name="index" label="Tabla" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="index">
      <rental-periods-index />
    </q-tab-panel>

    <q-tab-panel name="calendar">
      <rental-periods-calendar />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref } from "vue";

import RentalPeriodsIndex from "src/components/RentalPeriods/RentalPeriodsIndex.vue";
import RentalPeriodsCalendar from "src/components/RentalPeriods/RentalPeriodsCalendar.vue";

const tab = ref("calendar");
</script>
