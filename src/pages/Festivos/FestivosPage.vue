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
      <q-tab name="index" label="Lista" />
      <!-- <q-tab name="calendar" label="Calendario" /> -->
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="index" class="q-pa-none">
        <festivo-index />
      </q-tab-panel>

      <q-tab-panel name="calendar">
        <festivo-calendar />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup>
import { ref } from "vue";

import FestivoIndex from "src/components/Festivo/FestivoIndex.vue";
import FestivoCalendar from "src/components/Festivo/FestivoCalendar.vue";

const tab = ref("index");
</script>
