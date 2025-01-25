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
  </q-tab-panels>
</template>

<script setup>
import { ref } from "vue";

import VisitCalendar from "src/components/Visits/VisitCalendar.vue";
import VisitIndex from "src/components/Visits/VisitIndex.vue";

const tab = ref("visits");
</script>
