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
    <q-tab name="index" label="Incapacidades" />
    <q-tab name="calendar" label="Calendario" />
  </q-tabs>

  <q-separator />

  <q-tab-panels v-model="tab" animated>
    <q-tab-panel name="index" class="q-pa-none">
      <incapacity-index />
    </q-tab-panel>

    <q-tab-panel name="calendar" class="q-pa-none">
      <q-item>
        <q-item-section>
          <incapacity-calendar />
        </q-item-section>
      </q-item>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref } from "vue";

import IncapacityIndex from "src/components/Incapacity/IncapacityIndex.vue";
import IncapacityCalendar from "src/components/Incapacity/IncapacityCalendar.vue";

const tab = ref("index");
</script>
