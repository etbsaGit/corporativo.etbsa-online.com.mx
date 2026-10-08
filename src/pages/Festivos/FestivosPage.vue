<template>
  <q-card>
    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="festivos_index" label="Festivos" />
      <q-tab name="cuenta_index" label="Días a Cuenta" />
      <!-- <q-tab name="calendar" label="Calendario" /> -->
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="festivos_index" class="q-pa-none">
        <festivo-index />
      </q-tab-panel>

      <q-tab-panel name="cuenta_index" class="q-pa-none">
        <dias-a-cuenta-index />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup>
import { ref } from "vue";

import FestivoIndex from "src/components/Festivo/FestivoIndex.vue";
import FestivoCalendar from "src/components/Festivo/FestivoCalendar.vue";
import DiasACuentaIndex from "src/components/Festivo/DiasAcuentaIndex.vue";
const tab = ref("festivos_index");
</script>
