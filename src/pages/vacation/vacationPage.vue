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
    <q-tab name="myVacation" label="Mis vacaciones" />
    <q-tab name="vacationsRH" label="Vacaciones" />
    <q-tab name="calendar" label="Calendario" />
    <q-tab name="report" label="Reporte" v-if="checkRole('RRHH')" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="myVacation" class="q-pa-none">
      <my-vacation-index />
    </q-tab-panel>

    <q-tab-panel name="vacationsRH" class="q-pa-none">
      <vacation-all />
    </q-tab-panel>

    <q-tab-panel name="calendar" class="q-pa-none">
      <q-item>
        <q-item-section>
          <vacation-calendar />
        </q-item-section>
      </q-item>
    </q-tab-panel>

    <q-tab-panel name="report" class="q-pa-none">
      <vacation-report />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref } from "vue";

import MyVacationIndex from "src/components/Vacation/MyVacationIndex.vue";
import VacationAll from "src/components/Vacation/VacationAll.vue";
import VacationCalendar from "src/components/Vacation/VacationCalendar.vue";
import VacationReport from "src/components/Vacation/VacationReport.vue";
import { checkRole } from "src/boot/functions";

const tab = ref("myVacation");
</script>
